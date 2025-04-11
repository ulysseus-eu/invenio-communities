import React from 'react'
import { i18next } from "@translations/invenio_communities/i18next";
import {
    FieldLabel,
    TextField,
    SelectField,
    TextAreaField,
    RadioField
} from "react-invenio-forms";
import _get from "lodash/get";
import {
    RelevantPublicationsField,
    MostSignificantProjectsField
} from "@js/invenio_rdm_records";
import {
    Checkbox,
    Header
} from "semantic-ui-react";

export const CommunityPersonAdditionalFields = ({ fieldPath, personValues }) => {
    const genderOptions = [
        { key: "m", value: "m", text: "Male" },
        { key: "f", value: "f", text: "Female" },
        { key: "nb", value: "nb", text: "Non binary" },
        {
            key: "nts",
            value: "nts",
            text: "I prefer not to say",
        },
    ]

    const universityOptions = [
        { key: "use", value: "USE", text: "University of Seville" },
        { key: "unica", value: "UNICA", text: "University of Côte d’Azur" },
        { key: "unige", value: "UNIGE", text: "University of Genoa" },
        { key: "tuke", value: "TUKE", text: "Technical University of Košice" },
        { key: "mci", value: "MCI", text: "MCI | The Entrepreneurial School" },
        { key: "hh", value: "HH", text: "Haaga-Helia University of Applied Sciences" },
        { key: "wwu", value: "WWU", text: "University of Münster" },
        { key: "ucg", value: "UCG", text: "University of Montenegro" },
    ];

    const expertsProfileOptions = [
        { key: "researcher", value: "researcher", text: "Researcher" },
        {
            key: "teacher-lecturer",
            value: "teacher-lecturer",
            text: "Teacher/Lecturer",
        },
        {
            key: "ulysseus-staff",
            value: "ulysseus-staff",
            text: "Ulysseus staff",
        },
    ];

    const languageOptions = [
        {
            key: "english",
            value: "english",
            text: "English",
        },
        {
            key: "spanish",
            value: "spanish",
            text: "Spanish",
        },
        {
            key: "french",
            value: "french",
            text: "French",
        },
        {
            key: "italian",
            value: "italian",
            text: "Italian",
        },
        {
            key: "german",
            value: "german",
            text: "German",
        },
        {
            key: "slovakian",
            value: "slovakian",
            text: "Slovakian",
        },
        {
            key: "finnish",
            value: "finnish",
            text: "Finnish",
        },
        {
            key: "montenegrin",
            value: "montenegrin",
            text: "Montenegrin",
        },
        {
            key: "afrikaans",
            value: "afrikaans",
            text: "Afrikaans",
        },
        {
            key: "albanian",
            value: "albanian",
            text: "Albanian",
        },
        {
            key: "amharic",
            value: "amharic",
            text: "Amharic",
        },
        {
            key: "arabic",
            value: "arabic",
            text: "Arabic",
        },
        {
            key: "armenian",
            value: "armenian",
            text: "Armenian",
        },
        {
            key: "azerbaijani",
            value: "azerbaijani",
            text: "Azerbaijani",
        },
        {
            key: "basque",
            value: "basque",
            text: "Basque",
        },
        {
            key: "belarusian",
            value: "belarusian",
            text: "Belarusian",
        },
        {
            key: "bengali",
            value: "bengali",
            text: "Bengali",
        },
        {
            key: "bosnian",
            value: "bosnian",
            text: "Bosnian",
        },
        {
            key: "bulgarian",
            value: "bulgarian",
            text: "Bulgarian",
        },
        {
            key: "burmese",
            value: "burmese",
            text: "Burmese",
        },
        {
            key: "catalan",
            value: "catalan",
            text: "Catalan",
        },
        {
            key: "chinese",
            value: "chinese",
            text: "Chinese",
        },
        {
            key: "croatian",
            value: "croatian",
            text: "Croatian",
        },
        {
            key: "czech",
            value: "czech",
            text: "Czech",
        },
        {
            key: "danish",
            value: "danish",
            text: "Danish",
        },
        {
            key: "dutch",
            value: "dutch",
            text: "Dutch",
        },
        {
            key: "esperanto",
            value: "esperanto",
            text: "Esperanto",
        },
        {
            key: "estonian",
            value: "estonian",
            text: "Estonian",
        },
        {
            key: "filipino",
            value: "filipino",
            text: "Filipino",
        },
        {
            key: "flemish",
            value: "flemish",
            text: "Flemish",
        },
        {
            key: "georgian",
            value: "georgian",
            text: "Georgian",
        },
        {
            key: "greek",
            value: "greek",
            text: "Greek",
        },
        {
            key: "gujarati",
            value: "gujarati",
            text: "Gujarati",
        },
        {
            key: "haitian-creole",
            value: "haitian-creole",
            text: "Haitian Creole",
        },
        {
            key: "hebrew",
            value: "hebrew",
            text: "Hebrew",
        },
        {
            key: "hindi",
            value: "hindi",
            text: "Hindi",
        },
        {
            key: "hungarian",
            value: "hungarian",
            text: "Hungarian",
        },
        {
            key: "icelandic",
            value: "icelandic",
            text: "Icelandic",
        },
        {
            key: "indonesian",
            value: "indonesian",
            text: "Indonesian",
        },
        {
            key: "irish",
            value: "irish",
            text: "Irish",
        },
        {
            key: "japanese",
            value: "japanese",
            text: "Japanese",
        },
        {
            key: "javanese",
            value: "javanese",
            text: "Javanese",
        },
        {
            key: "kannada",
            value: "kannada",
            text: "Kannada",
        },
        {
            key: "kazakh",
            value: "kazakh",
            text: "Kazakh",
        },
        {
            key: "khmer",
            value: "khmer",
            text: "Khmer",
        },
        {
            key: "korean",
            value: "korean",
            text: "Korean",
        },
        {
            key: "kurdish",
            value: "kurdish",
            text: "Kurdish",
        },
        {
            key: "lao",
            value: "lao",
            text: "Lao",
        },
        {
            key: "latvian",
            value: "latvian",
            text: "Latvian",
        },
        {
            key: "lithuanian",
            value: "lithuanian",
            text: "Lithuanian",
        },
        {
            key: "luxembourgish",
            value: "luxembourgish",
            text: "Luxembourgish",
        },
        {
            key: "macedonian",
            value: "macedonian",
            text: "Macedonian",
        },
        {
            key: "malay",
            value: "malay",
            text: "Malay",
        },
        {
            key: "malayalam",
            value: "malayalam",
            text: "Malayalam",
        },
        {
            key: "maltese",
            value: "maltese",
            text: "Maltese",
        },
        {
            key: "marathi",
            value: "marathi",
            text: "Marathi",
        },
        {
            key: "mongolian",
            value: "mongolian",
            text: "Mongolian",
        },
        {
            key: "nepali",
            value: "nepali",
            text: "Nepali",
        },
        {
            key: "norwegian",
            value: "norwegian",
            text: "Norwegian",
        },
        {
            key: "pashto",
            value: "pashto",
            text: "Pashto",
        },
        {
            key: "persian",
            value: "persian",
            text: "Persian",
        },
        {
            key: "polish",
            value: "polish",
            text: "Polish",
        },
        {
            key: "portuguese",
            value: "portuguese",
            text: "Portuguese",
        },
        {
            key: "punjabi",
            value: "punjabi",
            text: "Punjabi",
        },
        {
            key: "romanian",
            value: "romanian",
            text: "Romanian",
        },
        {
            key: "russian",
            value: "russian",
            text: "Russian",
        },
        {
            key: "serbian",
            value: "serbian",
            text: "Serbian",
        },
        {
            key: "sinhala",
            value: "sinhala",
            text: "Sinhala",
        },
        {
            key: "slovenian",
            value: "slovenian",
            text: "Slovenian",
        },
        {
            key: "swahili",
            value: "swahili",
            text: "Swahili",
        },
        {
            key: "swedish",
            value: "swedish",
            text: "Swedish",
        },
        {
            key: "tamil",
            value: "tamil",
            text: "Tamil",
        },
        {
            key: "telugu",
            value: "telugu",
            text: "Telugu",
        },
        {
            key: "thai",
            value: "thai",
            text: "Thai",
        },
        {
            key: "turkish",
            value: "turkish",
            text: "Turkish",
        },
        {
            key: "ukrainian",
            value: "ukrainian",
            text: "Ukrainian",
        },
        {
            key: "urdu",
            value: "urdu",
            text: "Urdu",
        },
        {
            key: "uzbek",
            value: "uzbek",
            text: "Uzbek",
        },
        {
            key: "vietnamese",
            value: "vietnamese",
            text: "Vietnamese",
        },
        {
            key: "welsh",
            value: "welsh",
            text: "Welsh",
        },
        {
            key: "yiddish",
            value: "yiddish",
            text: "Yiddish",
        },
        {
            key: "yoruba",
            value: "yoruba",
            text: "Yoruba",
        },
    ];

    return (
        <>
            <TextField
                fluid
                fieldPath={`${fieldPath}.given_name`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.given_name`}
                        icon="user"
                        label={i18next.t("First name")}
                    />
                }
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.family_name`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.family_name`}
                        icon="user"
                        label={i18next.t("Last name")}
                    />
                }
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.email`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.email`}
                        icon="mail"
                        label={"E-Mail"}
                    />
                }
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.orcid`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.orcid`}
                        label={"Orcid"}
                        icon="user"
                    />
                }
            />
            <TextField
                fluid
                fieldPath={`${fieldPath}.other_profiles`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.other_profiles`}
                        label={"Other profiles"}
                        icon="user"
                    />
                }
            />

            <SelectField
                clearable
                fieldPath={`${fieldPath}.gender`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.gender`}
                        label={"Gender"}
                        icon="user"
                    />
                }
                options={genderOptions}
            />

            <SelectField
                clearable
                fieldPath={`${fieldPath}.languages`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.languages`}
                        label="Language"
                        icon="language"
                    />
                }
                options={languageOptions}
            />

            <SelectField
                clearable
                fieldPath={`${fieldPath}.university`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.university`}
                        icon="university"
                        label={"University"}
                    />
                }
                options={universityOptions}
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.faculty_center_institute`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.faculty_center_institute`}
                        icon="university"
                        label={"Faculty / Center / Institute"}
                    />
                }
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.department`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.department`}
                        icon="university"
                        label={"Department"}
                    />
                }
            />

            <SelectField
                clearable
                fieldPath={`${fieldPath}.experts_profile`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.experts_profile`}
                        icon="university"
                        label={"Expert's profile"}
                    />
                }
                options={expertsProfileOptions}
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.career_stage`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.career_stage`}
                        icon="university"
                        label={"Career stage"}
                    />
                }
            />
            <TextField
                fluid
                fieldPath={`${fieldPath}.research_group`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.research_group`}
                        icon="university"
                        label={"Research Group"}
                    />
                }
            />
            <TextField
                fluid
                fieldPath={`${fieldPath}.principal_investigator`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.principal_investigator`}
                        icon="university"
                        label={"Principal Investigator"}
                    />
                }
            />
            <TextField
                fluid
                fieldPath={`${fieldPath}.area_s_of_expertise`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.area_s_of_expertise`}
                        icon="university"
                        label={"Area/s of expertise"}
                    />
                }
            />
            <TextAreaField
                fieldPath={`${fieldPath}.additional_keywords`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.additional_keywords`}
                        icon="pencil"
                        label={"Additional Keywords"}
                    />
                }
                fluid
            />
            <TextAreaField
                fieldPath={`${fieldPath}.main_keywords`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.main_keywords`}
                        icon="pencil"
                        label={"Main Keywords"}
                    />
                }
                fluid
            />

            <RadioField
                fieldPath={`${fieldPath}.eu_proposal_writer`}
                checked={
                    _get(personValues, "eu_proposal_writer", "null") == "true"
                }
                control={Checkbox}
                label={"EU proposal writer"}
                value={
                    _get(personValues, "eu_proposal_writer", "null") == "true"
                        ? "false"
                        : "true"
                }
            />
            <RadioField
                checked={
                    _get(personValues, "eu_project_leader", "null") == "true"

                }
                control={Checkbox}
                fieldPath={`${fieldPath}.eu_project_leader`}
                label={"EU project leader"}
                value={
                    _get(personValues, "eu_project_leader", "null") == "true"
                        ? "false"
                        : "true"
                }
            />

            <TextField
                fluid
                fieldPath={`${fieldPath}.coordinated_projects_and_calls`}
                label={
                    <FieldLabel
                        htmlFor={`${fieldPath}.coordinated_projects_and_calls`}
                        icon="university"
                        label={"Coordinated projects and calls"}
                    />
                }
            />

            <RadioField
                checked={
                    _get(personValues, "eu_project_member", "null") == "true"
                }
                control={Checkbox}
                fieldPath={`${fieldPath}.eu_project_member`}
                label={"EU project member"}
                value={
                    _get(personValues, "eu_project_member", "null") == "true"
                        ? "false"
                        : "true"
                }
            />
            <RadioField
                checked={
                    _get(personValues, "eu_project_evaluator", "null") == "true"
                }
                control={Checkbox}
                fieldPath={`${fieldPath}.eu_project_evaluator`}
                label={"EU project evaluator"}
                value={
                    _get(personValues, "eu_project_evaluator", "null") == "true"
                        ? "false"
                        : "true"
                }
            />
            <RadioField
                checked={
                    _get(personValues, "knowledge_transfer", "null") == "true"
                }
                control={Checkbox}
                fieldPath={`${fieldPath}.knowledge_transfer`}
                label={"Knowledge Transfer"}
                value={
                    _get(personValues, "knowledge_transfer", "null") == "true"
                        ? "false"
                        : "true"
                }
            />
            <RadioField
                checked={
                    _get(personValues, "patents", "null") == "true"
                }
                control={Checkbox}
                fieldPath={`${fieldPath}.patents`}
                label={"Patents"}
                value={
                    _get(personValues, "patents", "null") == "true"
                        ? "false"
                        : "true"
                }
            />

            <RadioField
                checked={
                    _get(personValues, "interest_in_joint_research_groups", "null") == "true"
                }
                control={Checkbox}
                fieldPath={`${fieldPath}.interest_in_joint_research_groups`}
                label={"Interest in Joint Research Groups"}
                value={
                    _get(personValues, "interest_in_joint_research_groups", "null") == "true"
                        ? "false"
                        : "true"
                }
            />

            <Header as='h2' icon='file' content='Relevant Publications' />
            <RelevantPublicationsField
                fieldPath={`${fieldPath}.additional_relevant_publications`}
                defaultValue={personValues.additional_relevant_publications}
            />

            <Header as='h2' icon='file' content='Most Significant Projects' />
            <MostSignificantProjectsField
                fieldPath={`${fieldPath}.additional_most_significant_projects`}
                defaultValue={personValues.additional_most_significant_projects}
            />

        </>
    )
}
