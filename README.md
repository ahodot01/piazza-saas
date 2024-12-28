Piazza-SaaS is a Twitter-like cloud-based web application built using Node.js, Express.js, MongoDB,
Docker and support of OAuth 2.0. The program is deployed on a Google Cloud Virtual
Machine (VM). While the backend and basic functionality are fully completed, the frontend
currently remains missing because it was not an essential component of this project.
However, the essential functionalities - such as user authentication, publishing, liking,
disliking - are available and operable via RESTful APIs. To develop a simple and effective
frontend solution for the Piazza-SaaS application, I would use React.js (due its flexibility,
wide usage, ease of migration and plenty of community support options).

Key functionalities:

• User/s authentication (JWT-based and Google OAuth 2.0)

• Posting, liking, disliking, commenting, and reporting messages.

• Sorting posts by topic and fetching most active or expired posts.

• Secure deployment using Docker and public accessibility via Ngrok for testing.
