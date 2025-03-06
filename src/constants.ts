
export const DatabaseRepositoryConstants = {
    usersRepository: "USERS_REPOSITORY",
    rolesRepository: "ROLES_REPOSITORY",
    permissionsRepository: "PERMISSIONS_REPOSITORY",
    dataSource: "DATA_SOURCE",
    vendorsRepository: "VENDORS_REPOSITORY",
    addressRepository: "ADDRESS_REPOSITORY",
    categoriesRepository: "CATEGORIES_REPOSITORY",
    productsRepository: "PRODUCTS_REPOSITORY",
    productsVariantsRepository: "PRODUCTS_VARIANTS_REPOSITORY"
};

export const JwtStrategyName = "JWT"

export const CHECK_POLICIES_KEY = 'check_policy';

export const IS_PUBLIC_KEY = 'isPublic'

export const microservicesRMQKey = {
    MESSAGE_QUEUE: "MESSAGE_QUEUE",
    SEND_EMAIL_ACCOUNT_VERIFICATION: "SEND_EMAIL_ACCOUNT_VERIFICATION",
    SEND_PHONENUMBER_ACCOUNT_VERIFICATION: "SEND_PHONENUMBER_ACCOUNT_VERIFICATION",
    SEND_EMAIL_RECUPERATION_ACCOUNT: "SEND_EMAIL_RECUPERATION_ACCOUNT"
}

export const googleStorageEndpoint = "https://storage.googleapis.com/"

export const googleStorageProfileFolder = "profilePicture/"

export const googleUrlKeys = {
    addressValidationAPI: "https://addressvalidation.googleapis.com/v1:validateAddress"
}

export const validMimeTypesForFiles = ["png", "jpg", "jpeg", "webp", "svg"]
export const maxFileSize = 10000000