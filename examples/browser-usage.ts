import { EmailValidator } from "../src"

// Browser-safe validation (no DNS checks)
async function browserExample() {
  const validator = new EmailValidator({
    checkFormat: true,
    checkDeliverability: true,
    apiProvider: "mailgun",
    apiKey: "your-mailgun-api-key",
  })

  const emailInput = document.getElementById("email") as HTMLInputElement
  const validateButton = document.getElementById("validate") as HTMLButtonElement
  const resultDiv = document.getElementById("result") as HTMLDivElement

  validateButton.addEventListener("click", async () => {
    const email = emailInput.value

    if (!email) {
      resultDiv.innerHTML = '<p style="color: red;">Please enter an email address</p>'
      return
    }

    resultDiv.innerHTML = "<p>Validating...</p>"

    try {
      const result = await validator.validate(email)

      if (result.isValid) {
        resultDiv.innerHTML = `
          <p style="color: green;">✓ Email is valid</p>
          ${result.warnings.length > 0 ? `<p style="color: orange;">Warnings: ${result.warnings.join(", ")}</p>` : ""}
        `
      } else {
        resultDiv.innerHTML = `
          <p style="color: red;">✗ Email is invalid</p>
          <p>Errors: ${result.errors.join(", ")}</p>
        `
      }
    } catch (error) {
      resultDiv.innerHTML = `<p style="color: red;">Validation failed: ${error}</p>`
    }
  })
}

// Initialize when DOM is loaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", browserExample)
}
