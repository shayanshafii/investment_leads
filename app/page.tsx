"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import schemas from "@/schemas.json"

interface StealthFounder {
  entity_urn: string
  linkedin_url: string | null
  full_name: string | null
  current_title: string | null
  current_company: string | null
  former_title: string | null
  former_company: string | null
  email: string | null
  created_at: string
}

interface FreeAgent {
  entity_urn: string
  linkedin_url: string | null
  full_name: string | null
  former_title: string | null
  former_company: string | null
  email: string | null
  created_at: string
}

interface SchemaMetadata {
  name: string
  table_description?: string
}

interface Schema {
  metadata: SchemaMetadata
}

const getTableDescription = (tableName: string): string => {
  const schema = Object.values(schemas).find(
    (s: Schema) => s.metadata?.name === tableName
  )
  return schema?.metadata?.table_description || ""
}

const stealthFoundersDescription = getTableDescription("stealth_founders")
const freeAgentsDescription = getTableDescription("free_agents")

export default function Home() {
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)
  const [stealthFounders, setStealthFounders] = useState<StealthFounder[]>([])
  const [freeAgents, setFreeAgents] = useState<FreeAgent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasQueried, setHasQueried] = useState(false)

  const handleQuery = async () => {
    if (!date) {
      setError("Please select a date")
      return
    }

    setLoading(true)
    setError(null)
    setHasQueried(true)

    try {
      const dateString = format(date, "yyyy-MM-dd")
      const response = await fetch(`/api/query?date=${dateString}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch data")
      }

      const data = await response.json()
      setStealthFounders(data.stealthFounders || [])
      setFreeAgents(data.freeAgents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setStealthFounders([])
      setFreeAgents([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 pt-4 pb-4 border-b border-gray-200 mb-8">
          Investment Leads
        </h1>
        <p className="text-gray-600 mb-6">
          Investment Leads is a web app interface for viewing founders, nodes, and leads detected on any given day. Please select a date and click &quot;Query&quot; to see the intel discovered for that day.
        </p>
        <div className="flex flex-row gap-6 items-end mb-8">
          <div className="border border-gray-200 rounded-md">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleQuery}
              disabled={loading || !date}
            >
              {loading ? "Querying..." : "Query"}
            </Button>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        {hasQueried && !loading && (
          <div className="grid gap-6">
            {stealthFounders.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                  Stealth Founders
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {stealthFoundersDescription}
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Former Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Former Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stealthFounders.map((founder) => (
                        <tr key={founder.entity_urn} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                            {founder.full_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {founder.current_title || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {founder.current_company || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {founder.former_title || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {founder.former_company || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {founder.email || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {freeAgents.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                  Free Agents
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {freeAgentsDescription}
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Former Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Former Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {freeAgents.map((agent) => (
                        <tr key={agent.entity_urn} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                            {agent.full_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {agent.former_title || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {agent.former_company || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 break-words">
                            {agent.email || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {stealthFounders.length === 0 && freeAgents.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500 text-sm">
                  No results found for the selected date.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

