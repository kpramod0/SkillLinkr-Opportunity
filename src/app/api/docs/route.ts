import { NextResponse } from 'next/server'

// In a real implementation, this would read from docs/openapi.yaml
const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SkillLinkr Opportunities API',
    version: '1.0.0',
    description: 'Public API for accessing verified student opportunities.'
  },
  paths: {
    '/api/v1/public/opportunities': {
      get: {
        summary: 'List published opportunities',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'query', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Successful response' }
        }
      }
    },
    '/api/v1/public/opportunities/{id}': {
      get: {
        summary: 'Get opportunity details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Successful response' }
        }
      }
    }
  }
}

export async function GET() {
  return NextResponse.json(openapiSpec)
}
