<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Use TanStack content routes and shared brand components; dashboard modules stay in components so routing remains simple.
- Use Cloud tables with owner-role RLS for business records; only the verified designated owner receives a role through an auth lifecycle trigger.
- Public booking requests use a narrow database function and unique active-slot index; never expose customer rows anonymously.
- Productivity tools use explicit template-based fallback until AI is connected; generated drafts must be reviewed and never automatically sent.
- Public business information comes from the singleton business_settings record through the shared query and editor; owner-only RLS protects writes and public email never changes authentication access.
