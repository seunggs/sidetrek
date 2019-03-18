export const getProjectId = async (prisma, where) => {
  const projectData = await prisma.query.project({ where })
  return projectData.data.id
}