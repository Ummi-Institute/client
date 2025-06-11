export interface User {
    _id: string
    email: string
    firstName: string
    lastName: string
    info: any
    avatar: {
        gender: 'boy' | 'girl'
        skinTone: string
        hairColor?: string
        hairStyle?: string
    }
    role: UserRole
    createdAt: Date
    updatedAt: Date
}

export enum UserRole {
    admin = 'admin',
    staff = 'basic',
}
