const KIT_ENDPOINT = 'https://app.kit.com/forms';

const NETWORK_ERROR = 'We couldn’t reach the server. Check your connection and try again.';
const REJECTED_ERROR = 'That submission was rejected. Check your details and try again.';

interface KitResponse {
  status?: 'success' | 'quarantined' | 'failed';
  url?: string;
  errors?: { messages?: string[] };
}

// Kit answers rejections with HTTP 200 and `status: 'failed'`. `quarantined`
// means its spam guard held the signup until the visitor passes the challenge
// at `url`, so that URL is handed back for the caller to embed.
export async function submitToKit(formId: string, form: HTMLFormElement): Promise<{ guardUrl?: string }> {
  const body = new FormData(form);

  // ck.js sends these too; Kit records them against the subscriber.
  body.append('host', window.location.href);
  body.append('referrer', document.referrer);

  const response = await fetch(`${KIT_ENDPOINT}/${formId}/subscriptions`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  }).catch(() => {
    throw new Error(NETWORK_ERROR);
  });

  if (!response.ok) throw new Error(NETWORK_ERROR);

  const result: KitResponse = await response.json();

  if (result.status === 'success') return {};
  if (result.status === 'quarantined' && result.url) return { guardUrl: result.url };

  throw new Error(result.errors?.messages?.join(' ') || REJECTED_ERROR);
}
