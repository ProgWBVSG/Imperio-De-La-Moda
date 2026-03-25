const fs = require('fs');
const f1 = 'src/app/api/admin/productos/[id]/route.ts';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(/export async function GET\\(req: Request, \\{ params \\}: \\{ params: \\{ id: string \\} \\}\\) \\{/g, 'export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {\\n    const resolvedParams = await params;');
c1 = c1.replace(/export async function PUT\\(req: Request, \\{ params \\}: \\{ params: \\{ id: string \\} \\}\\) \\{/g, 'export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {\\n    const resolvedParams = await params;');
c1 = c1.replace(/export async function DELETE\\(req: Request, \\{ params \\}: \\{ params: \\{ id: string \\} \\}\\) \\{/g, 'export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {\\n    const resolvedParams = await params;');
c1 = c1.replace(/\\$\\{params\\.id\\}/g, '${resolvedParams.id}');
fs.writeFileSync(f1, c1);

const f2 = 'src/app/api/productos/[id]/route.ts';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace(/export async function GET\\(req: Request, \\{ params \\}: \\{ params: \\{ id: string \\} \\}\\) \\{/g, 'export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {\\n    const resolvedParams = await params;');
c2 = c2.replace(/\\$\\{params\\.id\\}/g, '${resolvedParams.id}');
fs.writeFileSync(f2, c2);
