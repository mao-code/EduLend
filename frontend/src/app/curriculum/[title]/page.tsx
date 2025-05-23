export default async function Page({
  params,
}: {
  params: Promise<{ title: string }>
}) {
  const { title } = await params
  return <div>My Post: {title}</div>
}