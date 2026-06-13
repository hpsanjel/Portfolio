# How to Create VPS_SSH_KEY for GitHub Deploy Workflow

## 1. Generate a new SSH key pair (on your local machine)

```bash
# Create a new SSH key specifically for GitHub Actions
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/github_actions_deploy
# When prompted for passphrase, press Enter to leave it empty (no passphrase for CI/CD)
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key)
- `~/.ssh/github_actions_deploy.pub` (public key)

## 2. Copy the public key to your VPS

```bash
# Display the public key (copy this output)
cat ~/.ssh/github_actions_deploy.pub
```

Then on your VPS:

```bash
# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "PASTE_THE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## 3. Add the private key to GitHub repository secrets

1. Copy the private key:
   ```bash
   cat ~/.ssh/github_actions_deploy
   ```

2. Go to your GitHub repository:
   - Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VPS_SSH_KEY`
   - Secret: Paste the entire private key content (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

## 4. Test the SSH connection (optional but recommended)

```bash
# Test SSH connection using the new key
ssh -i ~/.ssh/github_actions_deploy_deploy user@your-vps-ip
```

## 5. Clean up local files (optional)

```bash
# Remove local key files after adding to GitHub (they're now stored in GitHub secrets)
rm ~/.ssh/github_actions_deploy
rm ~/.ssh/github_actions_deploy.pub
```

## Important Notes

- **Never commit SSH keys to your repository**
- The private key goes in GitHub secrets, the public key goes on the VPS
- No passphrase is recommended for CI/CD automation
- Use `ed25519` for better security and performance
- Your workflow should now be able to SSH to the VPS using the `VPS_SSH_KEY` secret

## Alternative: Use existing SSH key

If you already have an SSH key that works with your VPS:

```bash
# Display your existing private key
cat ~/.ssh/id_ed25519  # or ~/.ssh/id_rsa
```

Add this as the `VPS_SSH_KEY` secret in GitHub, and ensure the corresponding public key is already on your VPS.
