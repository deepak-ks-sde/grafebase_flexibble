import { g, config, auth } from '@grafbase/sdk';

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(), 
  projects: g.relation(() => Project).list().optional(),
}).auth((rules) => {
  rules.public().read()
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(), 
  image: g.url(),
  liveSiteUrl: g.url(), 
  githubUrl: g.url(), 
  category: g.string().search(),
  createdBy: g.relation(() => User),
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET')
})

// @ts-ignore
datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL") // uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
  shadowDatabaseUrl = env("POSTGRES_URL_NON_POOLING") // used for migrations
}

export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})

