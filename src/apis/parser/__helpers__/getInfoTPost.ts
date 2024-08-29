import type { Cheerio, Element } from "cheerio"

import { getInfoAnchor } from "./getInfoAnchor"
import { getPathName } from "./getPathName"
import { int } from "./int"

export type TPost = ReturnType<typeof getInfoTPost>

export function getInfoTPost(cheerio: Cheerio<Element>, now: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const path = getPathName(cheerio.find("a").attr("href")!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = cheerio.find("img").attr("src")!
  const name = cheerio.find(".Title:eq(0)").text()

  const _chap = cheerio.find(".mli-eps > i:eq(0)").text()
  const chap = _chap === "TẤT" ? "Full_Season" : _chap
  const rate = parseFloat(
    cheerio.find(".anime-avg-user-rating:eq(0)").text().trim() ||
      cheerio.find(".AAIco-star:eq(0)").text().trim()
  )
  const views = int(
    cheerio
      .find(".Year:eq(0)")
      .text()
      .match(/[\d,]+/)?.[0]
      ?.replace(/,/g, "")
  )

  // =============== more =====================
  const quality =
    cheerio.find(".Qlty:eq(0)").text() ||
    cheerio.find(".mli-quality:eq(0)").text()

  const process = cheerio.find(".AAIco-access_time:eq(0)").text()

  const year = parseInt(cheerio.find(".AAIco-date_range:eq(0)").text())

  const description = cheerio.find(".Description > p:eq(0)").text()

  const studio = cheerio.find(".Studio:eq(0)").text().split(":", 2)[1]?.trim()

  const genre = cheerio
    .find(".Genre > a")
    .map((_i, item) => getInfoAnchor(cheerio.find(item)))
    .toArray()
  const timeschedule = cheerio.find(".mli-timeschedule")
  const countdown = int(timeschedule.attr("data-timer_second")) ?? undefined

  return {
    path,
    image,
    name,
    chap,
    rate,
    views,

    // === more ===
    quality,
    process,
    year,
    description,
    studio,
    genre,
    time_release:
      timeschedule.length > 0
        ? ((countdown === undefined
            ? undefined
            : Math.round(now / 1e3 + countdown) * 1e3) ?? null)
        : undefined
  }
}
