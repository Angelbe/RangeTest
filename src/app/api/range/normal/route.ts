import { getNormalRangeConfiguration } from "@/app/api/range/configurations";

export async function GET() {
  return Response.json(await getNormalRangeConfiguration());
}
