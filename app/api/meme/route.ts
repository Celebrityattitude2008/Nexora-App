import { NextResponse } from 'next/server';

type CaptionRequest = {
  template_id: string;
  boxes: { text: string }[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptionRequest;
    const { template_id, boxes } = body;

    if (!template_id || !boxes || boxes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing template_id or boxes' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      template_id,
      username: 'imgflip',
      password: 'imgflip',
    });

    boxes.forEach((box, idx) => {
      params.append(`boxes[${idx}][text]`, box.text || '');
    });

    const response = await fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error_message || 'Failed to generate meme' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
