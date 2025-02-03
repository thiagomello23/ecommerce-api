import { Subjects } from "src/casl/casl-ability.factory"
import { Action } from "src/casl/enums/casl-action"

export type JwtPayload = {
    sub: string,
    email: string
}

export type PermissionsSearch = {
    action: Action,
    subject: Subjects
}