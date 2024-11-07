import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function PrivacyPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Privacy Policy</h1>
        </div>
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <h1>Privacy Policy</h1>
          <p>
            <strong>Last Updated: 07/11/2024</strong>
          </p>

          <p>
            Lingo Loop is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our application. Please read this policy
            carefully to understand our views and practices regarding your
            personal data and how we will treat it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect and process the following types of information:</p>
          <ul>
            <li>
              <strong>Google Account Information</strong>: When you connect your
              Google account to our app, we may access certain limited
              information associated with your Google account such as your
              Google account ID
            </li>
            <li>
              <strong>Usage Data</strong>: We may collect information about how
              you use the app, including features used, preferences, and
              frequency. This data helps us understand how users interact with
              our app to improve functionality.
            </li>
            <li>
              <strong>Technical Data</strong>: This includes information about
              your device and internet connection (e.g., IP address, device
              type, operating system) to ensure our app functions properly
              across different devices.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>
              <strong>To Provide and Improve Our Services</strong>: Your Google
              account data helps personalize your experience and deliver the
              services offered by our app.
            </li>
            <li>
              <strong>To Communicate with You</strong>: We may send you updates,
              notifications, or respond to inquiries regarding the app.
            </li>
            <li>
              <strong>To Comply with Legal Requirements</strong>: We may process
              your data to comply with applicable laws, regulations, and legal
              requests.
            </li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal data to third parties.
            We may share information only in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>With Service Providers</strong>: We may engage trusted
              third-party service providers to help us operate our app, who are
              required to comply with this Privacy Policy and ensure the
              confidentiality and security of your data.
            </li>
            <li>
              <strong>For Legal Purposes</strong>: If required by law or to
              protect our rights, we may share your information with law
              enforcement or other authorities.
            </li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We prioritize the security of your personal data. We use technical
            and organizational measures to safeguard your information, including
            encryption and access control policies.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your data only for as long as necessary to fulfill the
            purposes outlined in this Privacy Policy unless a longer retention
            period is required or permitted by law. You may request deletion of
            your information by contacting us at swiftdevgg@gmail.com.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have certain rights regarding your personal information,
            including:
          </p>
          <ul>
            <li>
              <strong>Access</strong>: Request a copy of the data we have
              collected about you.
            </li>
            <li>
              <strong>Correction</strong>: Update or correct your personal data.
            </li>
            <li>
              <strong>Deletion</strong>: Request that we delete your personal
              data.
            </li>
          </ul>
          <p>
            If you wish to exercise any of these rights, please contact us at
            swiftdevgg@gmail.com.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and we will notify you of any
            significant updates. Your continued use of our app after changes
            indicates your acceptance of the updated policy.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
          </p>
          <p>
            <strong>Lingo Loop</strong>
            <br />
            Email: swiftdevgg@gmail.com
            <br />
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
