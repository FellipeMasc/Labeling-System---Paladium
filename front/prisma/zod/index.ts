import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','admin','createdAt','updatedAt','likelihoodScore']);

export const SessionScalarFieldEnumSchema = z.enum(['id','expiresAt','token','createdAt','updatedAt','ipAddress','userAgent','userId']);

export const AccountScalarFieldEnumSchema = z.enum(['id','accountId','providerId','userId','accessToken','refreshToken','idToken','accessTokenExpiresAt','refreshTokenExpiresAt','scope','password','createdAt','updatedAt']);

export const VerificationScalarFieldEnumSchema = z.enum(['id','identifier','value','expiresAt','createdAt','updatedAt']);

export const GroupScalarFieldEnumSchema = z.enum(['id','name','description','createdAt']);

export const GroupMemberScalarFieldEnumSchema = z.enum(['id','userId','groupId','joinedAt']);

export const ImageScalarFieldEnumSchema = z.enum(['id','filename','originalName','url','groupId','status','createdAt','updatedAt']);

export const TagScalarFieldEnumSchema = z.enum(['id','value','source','createdById','likelihoodScore','imageId','createdAt','updatedAt']);

export const LabelerUsageScalarFieldEnumSchema = z.enum(['id','userId','imageId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const ImageStatusSchema = z.enum(['UNLABELED','LABELED','REVIEWED']);

export type ImageStatusType = `${z.infer<typeof ImageStatusSchema>}`

export const TagSourceSchema = z.enum(['USER','AI','ADMIN']);

export type TagSourceType = `${z.infer<typeof TagSourceSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  admin: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  likelihoodScore: z.number().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable(),
  scope: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// GROUP SCHEMA
/////////////////////////////////////////

export const GroupSchema = z.object({
  id: z.cuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type Group = z.infer<typeof GroupSchema>

/////////////////////////////////////////
// GROUP MEMBER SCHEMA
/////////////////////////////////////////

export const GroupMemberSchema = z.object({
  id: z.cuid(),
  userId: z.string(),
  groupId: z.string(),
  joinedAt: z.coerce.date(),
})

export type GroupMember = z.infer<typeof GroupMemberSchema>

/////////////////////////////////////////
// IMAGE SCHEMA
/////////////////////////////////////////

export const ImageSchema = z.object({
  status: ImageStatusSchema,
  id: z.cuid(),
  filename: z.string(),
  originalName: z.string(),
  url: z.string(),
  groupId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Image = z.infer<typeof ImageSchema>

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  source: TagSourceSchema,
  id: z.cuid(),
  value: z.string(),
  createdById: z.string(),
  likelihoodScore: z.number().nullable(),
  imageId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Tag = z.infer<typeof TagSchema>

/////////////////////////////////////////
// LABELER USAGE SCHEMA
/////////////////////////////////////////

export const LabelerUsageSchema = z.object({
  id: z.cuid(),
  userId: z.string(),
  imageId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type LabelerUsage = z.infer<typeof LabelerUsageSchema>
