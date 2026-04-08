'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type OfferState = 'loading' | 'valid' | 'confirming' | 'done' | 'expired' | 'already_responded' | 'error';

export default function OfferPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const action = searchParams.get('action') as 'accept' | 'decline' | null;

  const [state, setState] = useState<OfferState>('loading');
  const [name, setName] = useState('');
  const [response, setResponse] = useState<'accepted' | 'declined' | null>(null);
  const [previousResponse, setPreviousResponse] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/offer/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setName(data.name ?? '');
          // If action is in URL, go straight to confirm
          if (action === 'accept' || action === 'decline') {
            setState('confirming');
          } else {
            setState('valid');
          }
        } else if (data.reason === 'already_responded') {
          setPreviousResponse(data.response);
          setState('already_responded');
        } else if (data.reason === 'expired') {
          setState('expired');
        } else {
          setState('error');
        }
      })
      .catch(() => setState('error'));
  }, [token, action]);

  async function handleRespond(chosenAction: 'accept' | 'decline') {
    setState('loading');
    try {
      const res = await fetch(`/api/offer/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: chosenAction }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
        setState('done');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/CW-logo-white.png" alt="CrftdWeb" width={140} height={40} className="mx-auto" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          {/* Loading */}
          {state === 'loading' && (
            <div className="py-8">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-sm text-zinc-500 mt-4">Processing…</p>
            </div>
          )}

          {/* Valid — show both options */}
          {state === 'valid' && (
            <>
              <p className="text-lg font-bold text-white mb-2">Hi {name.split(' ')[0]},</p>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                You&apos;ve been offered a position as a CrftdWeb Sales Representative.
                Please review the documents below and respond.
              </p>
              <div className="bg-zinc-800 rounded-xl p-4 mb-6 text-left space-y-2">
                <a
                  href="/rep-onboarding-pack.html"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors"
                >
                  📋 <span className="underline underline-offset-2">Onboarding Pack</span>
                </a>
                <a
                  href="/docs/rep-contractor-agreement.html"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors"
                >
                  📄 <span className="underline underline-offset-2">Contractor Agreement</span>
                </a>
              </div>
              <p className="text-xs text-zinc-500 mb-6">
                By accepting, you confirm you&apos;ve read both documents and agree to the contractor terms.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRespond('accept')}
                  className="flex-1 bg-white text-zinc-900 font-bold text-sm py-3 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => handleRespond('decline')}
                  className="flex-1 bg-zinc-800 text-zinc-400 font-medium text-sm py-3 rounded-xl border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  Decline
                </button>
              </div>
            </>
          )}

          {/* Confirming — action from URL, show confirmation */}
          {state === 'confirming' && action && (
            <>
              <p className="text-lg font-bold text-white mb-2">Hi {name.split(' ')[0]},</p>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                {action === 'accept'
                  ? 'You\'re about to accept the CrftdWeb Sales Rep offer. Make sure you\'ve reviewed the onboarding pack and contractor agreement.'
                  : 'Are you sure you want to decline the offer?'
                }
              </p>
              {action === 'accept' && (
                <div className="bg-zinc-800 rounded-xl p-4 mb-6 text-left space-y-2">
                  <a
                    href="/rep-onboarding-pack.html"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors"
                  >
                    📋 <span className="underline underline-offset-2">Onboarding Pack</span>
                  </a>
                  <a
                    href="/docs/rep-contractor-agreement.html"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors"
                  >
                    📄 <span className="underline underline-offset-2">Contractor Agreement</span>
                  </a>
                </div>
              )}
              <p className="text-xs text-zinc-500 mb-6">
                {action === 'accept'
                  ? 'By clicking confirm, you agree to the terms of the contractor agreement.'
                  : 'This cannot be undone.'
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRespond(action)}
                  className={`flex-1 font-bold text-sm py-3 rounded-xl transition-colors ${
                    action === 'accept'
                      ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  {action === 'accept' ? 'Confirm & Accept' : 'Confirm Decline'}
                </button>
                <button
                  onClick={() => setState('valid')}
                  className="flex-1 bg-zinc-800 text-zinc-400 font-medium text-sm py-3 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </>
          )}

          {/* Done */}
          {state === 'done' && (
            <>
              {response === 'accepted' ? (
                <>
                  <div className="text-4xl mb-4">🎉</div>
                  <p className="text-lg font-bold text-white mb-2">Welcome to CrftdWeb</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    You&apos;re in. You&apos;ll receive your login details within 24 hours with access to your rep portal, training, and everything you need to get started.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">👋</div>
                  <p className="text-lg font-bold text-white mb-2">No worries</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Thanks for letting us know. If you change your mind in the future, feel free to reach out at admin@crftdweb.com.
                  </p>
                </>
              )}
            </>
          )}

          {/* Expired */}
          {state === 'expired' && (
            <>
              <div className="text-4xl mb-4">⏰</div>
              <p className="text-lg font-bold text-white mb-2">Offer expired</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                This offer has expired. If you&apos;re still interested, email admin@crftdweb.com.
              </p>
            </>
          )}

          {/* Already responded */}
          {state === 'already_responded' && (
            <>
              <div className="text-4xl mb-4">{previousResponse === 'accepted' ? '✅' : '📬'}</div>
              <p className="text-lg font-bold text-white mb-2">Already responded</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {previousResponse === 'accepted'
                  ? 'You\'ve already accepted this offer. Check your email for login details.'
                  : 'You\'ve already responded to this offer. Contact admin@crftdweb.com with any questions.'
                }
              </p>
            </>
          )}

          {/* Error */}
          {state === 'error' && (
            <>
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg font-bold text-white mb-2">Something went wrong</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                This link may be invalid. Contact admin@crftdweb.com for help.
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          crftdweb.com &middot; admin@crftdweb.com
        </p>
      </div>
    </div>
  );
}
