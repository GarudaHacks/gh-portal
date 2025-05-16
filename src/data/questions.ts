import { ApplicationQuestion, APPLICATION_STATES, QUESTION_TYPE } from "@/types/application";

export const allQuestionsData: ApplicationQuestion[] = [
    {
      "id": "first_name",
      "text": "First Name",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "Enter your first name",
      "required": true,
      "validation": {
        "maxLength": 50,
      },
      "order": 1
    },
    {
      "id": "last_name",
      "text": "Last Name",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "Enter your last name",
      "required": true,
      "validation": {
        "maxLength": 50,
      },
      "order": 2
    },
    {
      "id": "preferredName",
      "text": "Preferred Name",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "Name you'd like us to call you",
      "required": false,
      "validation": {
        "maxLength": 50
      },
      "order": 3  
    },
    {
      "id": "date_of_birth",
      "text": "Date of Birth",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.DATE,
      "required": true,
      "validation": {
      },
      "order": 4
    },
    {
      "id": "linkedin",
      "text": "LinkedIn URL",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "https://www.linkedin.com/in/your-handle",
      "required": false,
      "validation": {
        "pattern": "^https?:\\/\\/(www\\.)?linkedin\\.com\\/.*$",
        "maxLength": 200
      },
      "order": 5
    },
    {
      "id": "github",
      "text": "GitHub Profile",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "https://github.com/your-handle",
      "required": false,
      "validation": {
        "pattern": "^https?:\\/\\/(www\\.)?github\\.com\\/.*$",
        "maxLength": 200
      },
      "order": 6
    },
    {
      "id": "portfolio",
      "text": "Portfolio Website",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "https://your-portfolio.com (optional)",
      "required": false,
      "validation": {
        "pattern": "^https?:\\/\\/.*$",
        "maxLength": 200
      },
      "order": 7
    },
    {
      "id": "gender_identity",
      "text": "Gender Identity",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.DROPDOWN,
      "required": false,
      "options": [
        "Woman",
        "Man",
        "Non-binary",
        "Prefer not to say",
        "Other"
      ],
      "order": 8
    },
    {
      "id": "education",
      "text": "Highest Level of Education",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.DROPDOWN,
      "required": true,
      "options": [
        "High School / Equivalent",
        "University (Undergraduate)",
        "Post-Graduate / Masters",
        "Bootcamp / Other"
      ],
      "order": 9
    },
    {
      "id": "school",
      "text": "School / Institution",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.STRING,
      "placeholder": "e.g., University of Toronto",
      "required": true,
      "validation": {
        "maxLength": 100
      },
      "order": 10
    },
    {
      "id": "year",
      "text": "Current Year of Study",
      "state": APPLICATION_STATES.PROFILE,
      "type": QUESTION_TYPE.NUMBER,
      "placeholder": "1",
      "required": false,
      "validation": {
        "minValue": 1,
        "maxValue": 5,
      },
      "order": 11
    },
    {
      "id": "hackathonCount",
      "text": "How many hackathons have you been to before?",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.NUMBER,
      "placeholder": "0",
      "required": true,
      "validation": {
        "minValue": 0,
        "maxValue": 99,
      },
      "order": 1
    },
    {
      "id": "desiredRoles",
      "text": "What roles would you like to take in a hackathon?",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.DROPDOWN,
      "required": true,
      "options": [
        "Developer",
        "Designer",
        "Product Manager",
        "Data Scientist",
        "Entrepreneur",
        "Other"
      ],
      "validation": {
        "minSelections": 1,
        "maxSelections": 3
      },
      "order": 2
    },
    {
      "id": "resume",
      "text": "Please upload your résumé",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.FILE,
      "required": true,
      "validation": {
        "allowedTypes": "application/pdf",
        "maxSize": 5
      },
      "order": 3
    },
    {
      "id": "motivation",
      "text": "What motivates you to build in Garuda Hacks?",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.TEXTAREA,
      "placeholder": "Answer in ≤ 150 words",
      "required": true,
      "validation": {
        "maxLength": 150
      },
      "order": 4
    },
    {
      "id": "bigProblem",
      "text": "If you had unlimited resources, what problem would you solve within Indonesia?",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.TEXTAREA,
      "placeholder": "Answer in ≤ 150 words",
      "required": true,
      "validation": {
        "maxLength": 150
      },
      "order": 5
    },
    {
      "id": "interestingProject",
      "text": "Share an interesting project you've previously worked on (technical or non-technical)",
      "state": APPLICATION_STATES.INQUIRY,
      "type": QUESTION_TYPE.TEXTAREA,
      "placeholder": "Answer in ≤ 150 words",
      "required": true,
      "validation": {
        "maxLength": 150,
      },
      "order": 6
    },
    {
      "id": "referralSource",
      "text": "Where did you hear about Garuda Hacks?",
      "state": APPLICATION_STATES.ADDITIONAL_QUESTION,
      "type": QUESTION_TYPE.DROPDOWN,
      "required": true,
      "options": [
        "Instagram",
        "Facebook",
        "Twitter/X",
        "LinkedIn",
        "University Club",
        "Friend",
        "Other"
      ],
      "order": 1
    },
    {
      "id": "accommodations",
      "text": "Please let us know of any event accommodations we can make for you",
      "state": APPLICATION_STATES.ADDITIONAL_QUESTION,
      "type": QUESTION_TYPE.TEXTAREA,
      "placeholder": "Dietary restrictions, accessibility needs, etc. (optional)",
      "required": false,
      "validation": {
        "maxLength": 600
      },
      "order": 2
    }
  ]
  