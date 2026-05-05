import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tasks = await prisma.adminTask.findMany({
      orderBy: { position: 'asc' }
    });
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, tags, checklist, due_date } = body;

    if (!title) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    // Get the highest position in the requested status to place it at the end
    const lastTask = await prisma.adminTask.findFirst({
      where: { status: status || 'TODO' },
      orderBy: { position: 'desc' },
    });

    const position = lastTask ? lastTask.position + 1024 : 1024; // Simple sorting gap

    const newTask = await prisma.adminTask.create({
      data: {
        title,
        description: description || "",
        status: status || "TODO",
        priority: priority || "NORMAL",
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        checklist: typeof checklist === "string" ? checklist : JSON.stringify(checklist || []),
        due_date: due_date ? new Date(due_date) : null,
        position
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
