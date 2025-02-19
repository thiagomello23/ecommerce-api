import { Ability, AbilityBuilder, AbilityClass, defineAbility, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "./enums/casl-action";
import { Users } from "src/users/users.entity";
import { UserRole } from "src/roles/enums/user-role";

export type Subjects = "Users" | "Validate" | "Address" | "Products" | "Category" |"all";

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Users) {
    const ability = defineAbility((can) => {
      for(const role of user.roles) {
        for(const permission of role.permissions) {
          if(permission?.conditions) {
            can(
              permission.action, 
              permission.subject,
              this.buildSimpleCaslConditions(permission.conditions)
            )
          } else {
            can(
              permission.action, 
              permission.subject
            )
          }
        }
      }
    })

    return ability;
  }

  private buildSimpleCaslConditions(conditions: any) {
    // Caso simples
    if (conditions.fields && conditions.matcher && conditions.value !== undefined) {
      const field = conditions.fields[0];
      
      switch (conditions.matcher) {
        case 'equals':
          if (conditions.value === "true") return { [field]: true };
          if (conditions.value === "false") return { [field]: false };
          return { [field]: conditions.value };
    
        case 'includes':
          return { [field]: { $in: Array.isArray(conditions.value) ? conditions.value : [conditions.value] } };
          
        case 'startsWith':
          return { [field]: { $regex: `^${conditions.value}` } };
          
        default:
          return { [field]: conditions.value };
      }
    } else {
      return {}
    }
  }

}