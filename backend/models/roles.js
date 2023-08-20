export const adminRole =  {
        name: "admin",
        permissions: [
            {
                name: "consult-unvalidated-promoters"
            },
            {
                name: "validate-promoters"
            },
            {
                name: "delete-promoters"
            }
        ]
    };

export const promoterRole = {
    name: "promoter",
        permissions: [
            {
                name: "manage-event"
            },
            {
                name: "add-event"
            },
            {
                name: "delete-event"
            },
            {
                name: "modify-event"
            }
        ]
}    