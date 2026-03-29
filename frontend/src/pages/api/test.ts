import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
  timestamp: string
}

export default function handler(request: NextApiRequest, response: NextApiResponse<ResponseData>) {
  response.status(200).json({
    message: 'API route working correctly',
    timestamp: new Date().toISOString(),
  })
}
