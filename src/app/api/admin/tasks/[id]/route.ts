import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Solo extraemos los campos que queremos actualizar
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.position !== undefined) updateData.position = body.position;
    if (body.due_date !== undefined) updateData.due_date = body.due_date ? new Date(body.due_date) : null;
    
    // Tags y checklist se esperan como string JSON o arrays
    if (body.tags !== undefined) {
      updateData.tags = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    }
    if (body.checklist !== undefined) {
      updateData.checklist = typeof body.checklist === "string" ? body.checklist : JSON.stringify(body.checklist);
    }

    const updatedTask = await prisma.adminTask.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.adminTask.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
