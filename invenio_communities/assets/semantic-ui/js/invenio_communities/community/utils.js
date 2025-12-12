/**
 * Class to handle community types
 */
export class CommunityType {
    static community = "community";
    static person = "expert";
    static organization = "organization";
    singulars = {
        person: CommunityType.person,
        expert: CommunityType.person,
        organization: CommunityType.organization,
        community: CommunityType.community,
    };
    plurals = {
        person: "experts",
        expert: "experts",
        community: "communities",
        organization: "organizations",
    };
    apis = {
        person: "persons",
        expert: "persons",
        community: "communities",
        organization: "organizations",
    };

    constructor(iType = CommunityType.community) {
        this.communityType = this.singulars[iType] ?? this.community;
    }

    getSingular() {
        if (
            Object.prototype.hasOwnProperty.call(
                this.singulars,
                this.communityType,
            )
        ) {
            return this.singulars[this.communityType];
        } else {
            return this.singulars[CommunityType.community];
        }
    }

    getPlural() {
        if (
            Object.prototype.hasOwnProperty.call(
                this.plurals,
                this.communityType,
            )
        ) {
            return this.plurals[this.communityType];
        } else {
            return this.plurals[CommunityType.community];
        }
        }

    getApi() {
        if (
            Object.prototype.hasOwnProperty.call(
                this.apis,
                this.communityType,
            )
        ) {
            return this.apis[this.communityType];
        } else {
            return this.apis[CommunityType.community];
        }
    }

    getListSingular() {
        return [...new Set(Object.values(this.singulars))];
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
export function capitalizeFirstLetter(iString) {
  if (iString?.length > 1) {
    return iString.charAt(0).toUpperCase() + iString.slice(1).toLowerCase();
  }
  else {
    return iString? iString.toUpperCase(): "";
  }
}
