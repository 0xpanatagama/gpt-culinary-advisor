// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string,
  pointsOfInterestPrompt: string,
  culinary: string,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let days = 4, city = 'Rio'
  if (req.body) {
    let body = JSON.parse(req.body)
    days = body.days
    city = body.city
  }

  if (days > 10) {
    days = 10
  }

  let basePrompt = `Imagine you're planning a food-filled culinary adventure in ${city} for ${days} days. Where would you go for a delicious and memorable culinary experience on each of these days?`
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550
      })
    })

    if (!response.ok) {
      throw new Error(`Unexpected response from OpenAI API: ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No valid response from OpenAI API')
    }

    const culinary = data.choices[0].text
    const pointsOfInterestPrompt = 'Extract the points of interest out of this text, identify and list down the unique culinary places mentioned in the text, with no additional words, separated by commas: ' + culinary

    res.status(200).json({
      message: 'success',
      pointsOfInterestPrompt,
      culinary
    })
  } catch (err) {
    console.log('error: ', err)
  }
}