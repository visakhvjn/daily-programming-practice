import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getDailyQuestion() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `
            Create a new coding problem suitable for intermediate level programmers. It should contain:

            A catchy title for the problem.
            A short description of the problem.
            3 examples with input/output.
            Constraints on the input.
            Real world applications of the problem.

            It will go inside a <div> tag with the class "question".

            The title should be in a <div> tag with the class "title".
            The examples should be in a <div> tag with the class "examples" and label Examples.
            The constraints should be in a <div> tag with the class "constraints" and label Constraints.
            The description should be in a <div> tag with the class "description".
            The real world applications should be in a <div> tag with the class "applications" and label Applications.

            Format it cleanly using html.

            Do not return any other text or explanation. Just the html code.
        `,
      },
    ],
  });

  let data = response.choices[0].message.content.trim();

  const start = data.indexOf('<div');
  const end = data.lastIndexOf('</div>') + '</div>'.length;

  data = data.substring(start, end);

  return data;
}