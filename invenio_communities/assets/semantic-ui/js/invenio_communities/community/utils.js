/**
 * Class to handle community types
 */
export class CommunityType {
    community = "community";
    person = "person";
    organization = "organization";
    singulars = {
        person: this.person,
        community: this.community,
        organization: this.organization,
    };
    plurals = {
        person: "persons",
        community: "communities",
        organization: "organizations",
    };

    constructor(iType = this.community) {
        this.communityType = iType;
    }

    getSingular() {
        if (Object.prototype.hasOwnProperty.call(this.singulars, this.communityType)) {
            return this.singulars[this.communityType];
        } else {
            return this.singulars[this.community];
        }
    }

    getPlural() {
        if (Object.prototype.hasOwnProperty.call(this.plurals, this.communityType)) {
            return this.plurals[this.communityType];
        } else {
            return this.plurals[this.community];
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
