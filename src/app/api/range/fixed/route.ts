import { getFixedRangeConfiguration } from "@/app/api/range/configurations";

export async function GET() {
  return Response.json(await getFixedRangeConfiguration());
}
