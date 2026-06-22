# Security Policy

## Supported Versions

The following versions of **Career Pilot** are currently supported with security updates:

| Version | Supported |
| ------- | --------- |
| main    | ✅ Yes     |

## Threat Model & CSRF Protection

Career Pilot employs a defense-in-depth strategy to prevent Cross-Site Request Forgery (CSRF) and Cross-Site WebSocket Hijacking (CSWSH) attacks:

1. **Bearer Tokens over Cookies**: The primary application API relies on Firebase ID tokens passed via the `Authorization: Bearer` header rather than cookies. Since standard web browsers do not automatically attach custom headers to cross-origin requests, this architecture natively mitigates classic CSRF vectors.
2. **CORS Restrictions**: Express middleware enforces strict CORS policies on the REST API, permitting requests only from explicit, known origins (e.g., the configured frontend URL).
3. **Socket.IO Origin Enforcement**: WebSocket connections are protected by an `allowRequest` hook that strictly validates the `Origin` header during the connection handshake. This ensures that an attacker cannot open a WebSocket connection on behalf of a victim from a malicious domain.
4. **Basic Auth Origin Checks**: Administrative routes using HTTP Basic Auth (such as BullMQ Dashboard) enforce a strict `Origin`/`Referer` check for all state-changing methods (`POST`, `PUT`, `DELETE`). This prevents an attacker from abusing cached Basic Auth credentials via cross-site requests.

## Reporting a Vulnerability

If you discover a security vulnerability in **Career Pilot**, please **do not open a public issue**.

Instead, report it responsibly by:

* 📧 Reaching out to the maintainer directly via their GitHub profile.
* 💬 Sending a private message through GitHub's messaging or social links listed in the profile.

### What to Include in Your Report

To help us investigate and resolve the issue efficiently, please include:

* A clear description of the vulnerability.
* Steps to reproduce the issue.
* Expected and actual behavior.
* Potential impact assessment.
* Any relevant screenshots, logs, or proof-of-concept examples.
* Any suggested fix (optional but appreciated).

## Response Timeline

| Action                    | Timeframe       |
| ------------------------- | --------------- |
| Acknowledgement of report | Within 48 hours |
| Status update             | Within 7 days   |
| Patch / fix release       | Within 30 days  |

## Vulnerability Handling Process

Once a vulnerability report is received, the following process will generally be followed:

1. The report will be reviewed and acknowledged.
2. The issue will be validated and its impact assessed.
3. A fix or mitigation strategy will be developed.
4. The reporter may be contacted for additional information if needed.
5. Security updates will be released once the issue has been addressed.

Please note that resolution timelines may vary depending on the complexity and severity of the reported issue.

## Security Advisories

For significant security issues, the project may use GitHub Security Advisories or release notes to communicate important security-related updates and fixes to users.

Users are encouraged to keep their local copies updated to receive the latest security improvements.

## Best Practices for Reporting

To help us investigate vulnerabilities efficiently:

* Provide detailed and accurate information.
* Include reproducible steps whenever possible.
* Share supporting evidence such as logs or screenshots.
* Clearly describe the potential impact of the issue.
* Avoid publicly disclosing the vulnerability before it has been addressed.

Providing complete information helps reduce investigation time and improves the response process.

## Responsible Disclosure

We follow a responsible disclosure process and kindly request that security researchers:

* Report vulnerabilities privately through the channels described above.
* Allow reasonable time for investigation and remediation before public disclosure.
* Refrain from actions that could compromise user data, privacy, or service availability.
* Cooperate with maintainers during the validation and remediation process when additional information is required.

We deeply appreciate security researchers and contributors who help keep **Career Pilot** safe and secure. 🙏

## References

* Career Pilot Repository: https://github.com/anurag3407/career-pilot
* GitHub Security Advisories: https://docs.github.com/en/code-security/security-advisories
* Adding a Security Policy to your repository: https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository
