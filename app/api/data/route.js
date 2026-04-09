import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
const DATA_FILE = join(process.cwd(), 'data', 'entries.json')
function readData() {
  if (!existsSync(DATA_FILE)) return []
  try { return JSON.parse(readFileSync(DATA_FILE,'utf-8')) } catch { return [] }
}
function writeData(data) {
  const dir = join(process.cwd(),'data')
  if (!existsSync(dir)) require('fs').mkdirSync(dir,{recursive:true})
  writeFileSync(DATA_FILE,JSON.stringify(data,null,2))
}
export async function GET() { return NextResponse.json(readData()) }
export async function POST(request) {
  const entry = await request.json()
  const data = readData()
  const idx = data.findIndex(d => d.date === entry.date)
  if (idx >= 0) data[idx] = entry; else data.push(entry)
  data.sort((a,b) => new Date(b.date)-new Date(a.date))
  writeData(data.slice(0,60))
  return NextResponse.json({ success: true })
}
