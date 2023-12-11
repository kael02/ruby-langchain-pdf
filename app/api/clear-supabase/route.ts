import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, res: NextResponse) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
    return NextResponse.json({ message: "env missing" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PRIVATE_KEY,
  );

  const { error } = await supabase
    .from("documents")
    .delete()
    .order("id")
    .range(0, 1000);

  if (error) {
    console.error("error deleting data", error);
    return NextResponse.json({ message: "cant delete" }, { status: 500 });
  }
  return NextResponse.json({ message: "deleted" }, { status: 200 });
}
