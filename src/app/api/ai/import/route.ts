import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, deckName } = await req.json();

    if (!prompt || !deckName) {
      return NextResponse.json({ error: 'Prompt e nome do deck são obrigatórios' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      // Mock para desenvolvimento se não houver chave (para o usuário ver a estrutura funcionando)
      // Em produção, isso deve ser um erro 500.
      console.warn('GOOGLE_GENERATIVE_AI_API_KEY não encontrada. Usando dados Mock.');
      
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      return NextResponse.json({
        cards: [
          { front: 'Apple', back: 'Maçã', association: 'The fruit that fell on Newton\'s head.' },
          { front: 'To break down', back: 'Quebrar, analisar', association: 'Think of breaking a complex problem into smaller pieces.' },
          { front: 'Serendipity', back: 'Serendipidade, acaso feliz', association: 'Finding something good without looking for it.' }
        ]
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um gerador e formatador de flashcards de alta performance, especializado no Método ITR.
            
            Sua missão é extrair ou gerar informações e organizá-las no formato de flashcards.
            O usuário pode enviar um pedido de criação (ex: "Gere 10 cards sobre...") ou uma lista já pronta para ser formatada (ex: uma lista de frases colada).
            
            INPUT DO USUÁRIO: "${prompt}"
            
            REGRAS CRÍTICAS:
            1. Máximo de 20 cards.
            2. VERIFICAÇÃO DE IDIOMA (Obrigatório): 
               - O campo 'front' deve conter SEMPRE o termo/frase em INGLÊS.
               - O campo 'back' deve conter SEMPRE a tradução em PORTUGUÊS.
               - Se o usuário inverter a ordem no input (ex: Português 👉 Inglês), você DEVE corrigir para que o Inglês fique no front e o Português no back.
            3. Para cada card, extraia ou crie:
               - 'front': O texto em INGLÊS.
               - 'back': O texto em PORTUGUÊS.
               - 'association': Uma frase de exemplo em inglês ou dica mnemônica curta.
            4. Se o input já contiver uma lista de cards, respeite o conteúdo original mas garanta a ordem correta dos idiomas.
            5. Retorne EXATAMENTE e APENAS o JSON, sem introduções ou conclusões.
            
            FORMATO DO JSON:
            {
              "cards": [
                { "front": "...", "back": "...", "association": "..." }
              ]
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('Erro na comunicação com a API de IA');
    }

    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text;
    
    // Limpeza de Markdown se necessário
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim();
    }

    const aiData = JSON.parse(text);

    return NextResponse.json(aiData);
  } catch (error) {
    console.error('AI Route Error:', error);
    return NextResponse.json({ error: 'Erro ao processar sua solicitação de IA' }, { status: 500 });
  }
}
