/**
 * Class to handle community types
 */
export class CommunityType {
    static community = "community";
    static person = "person";
    static organization = "organization";
    singulars = {
        person: CommunityType.person,
        community: CommunityType.community,
        organization: CommunityType.organization,
    };
    plurals = {
        person: "persons",
        community: "communities",
        organization: "organizations",
    };

    constructor(iType = CommunityType.community) {
        this.communityType = iType;
    }

    getSingular() {
        if (Object.prototype.hasOwnProperty.call(this.singulars, this.communityType)) {
            return this.singulars[this.communityType];
        } else {
            return this.singulars[CommunityType.community];
        }
    }

    getPlural() {
        if (Object.prototype.hasOwnProperty.call(this.plurals, this.communityType)) {
            return this.plurals[this.communityType];
        } else {
            return this.plurals[CommunityType.community];
        }
    }

    getSingularCapitalized() {
        return capitalizeFirstLetter(this.getSingular());
    }

    getPluralCapitalized() {
        return capitalizeFirstLetter(this.getPlural());
    }
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
