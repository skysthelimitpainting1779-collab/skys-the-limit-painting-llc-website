'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ResponsiveImage from '../components/ResponsiveImage';
import { trackEvent } from '../lib/analytics';

import { ENV } from '../lib/env';

export default function ReviewPage() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privateError, setPrivateError] = useState('');

  const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJ8d-Nq98d9kgR50-mR-K5k84";

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
    setPrivateError('');
    trackEvent('review_rating_select', { rating: selectedRating });
  };

  const handlePrivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateFeedback.trim()) {
      setPrivateError('Please add a few details so we can understand what needs attention.');
      return;
    }

    setIsSubmitting(true);
    setPrivateError('');
    trackEvent('private_feedback_submit', { rating: rating ?? undefined });

    try {
      const formId = ENV.FORMSPREE_FORM_ID || 'xanybvkd';
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: `Negative Client Feedback Alert (${rating} Stars)`,
          name: clientName,
          phone: clientPhone,
          rating: rating,
          feedback: privateFeedback,
        }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
      } else {
        setPrivateError('The private feedback form did not send. Please call or text 651-410-4196 so we can handle this directly.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setPrivateError('The private feedback form did not respond. Please call or text 651-410-4196 so we can handle this directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="relative overflow-hidden min-h-[calc(100svh-116px)] bg-[#070706] py-16 px-4 text-white sm:px-6 lg:px-8">
        <ResponsiveImage
          src="/brand/generated/sky-service-proof.webp"
          alt="Premium painting service proof and trade detailing"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070706] via-[#070706]/94 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070706] via-transparent to-transparent"></div>
        <div className="blueprint-grid absolute inset-0 opacity-18"></div>
        <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-70"></div>
        
        <div className="relative z-10 mx-auto max-w-2xl border border-[#d8c7aa]/16 bg-[#11100d]/90 p-8 md:p-12 overflow-hidden shadow-xl transition duration-500 hover:border-[#f0c067]/45">
          <div className="measurement-rules absolute inset-0 opacity-12 pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center">
            <span className="inline-block border border-[#f0c067]/30 bg-[#070706]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#f0c067]">
              Client Care & Quality
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-none text-white sm:text-5xl">
              How did we do?
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#c9c1b4]">
              Anthony and the Sky's the Limit team hold themselves to an elite, industrial-luxury standard. Your feedback helps us maintain our craftsmanship and protect our commitment to you.
            </p>
          </div>

          <hr className="my-8 border-[#d8c7aa]/15" />

          {/* Step 1: Star Rating Selection */}
          {rating === null ? (
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f0c067] mb-6">
                Tap to rate your experience
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    <Star
                      size={44}
                      className={`transition-colors stroke-[1.5] ${
                        star <= (hoverRating ?? 0) || star <= (rating ?? 0)
                          ? 'fill-[#f0c067] text-[#f0c067]'
                          : 'text-[#d8c7aa]/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Step 2: Funnel Flow - rating < 4 */
            <div>
              {/* Private feedback branch handles rating < 4 below. */}
              {rating >= 4 ? (
                /* Happy Client: Redirect to Google */
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0c067]/10 text-[#f0c067] mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white">We love to hear that!</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#c9c1b4]">
                    Since you had a strong experience, would you take 15 seconds to support an owner-operated local business by leaving a brief review on Google? A short note helps the next homeowner feel confident before they reach out.
                  </p>
                  
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('google_review_redirect_click', { rating })}
                    className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] transition-colors hover:bg-white"
                  >
                    Leave Us a Google Review <ArrowRight size={18} />
                  </a>

                  <button
                    type="button"
                    onClick={() => setRating(null)}
                    className="mt-4 text-xs font-semibold text-[#b9b2a6] hover:text-white underline"
                  >
                    Change rating
                  </button>
                </div>
              ) : (
                /* Unhappy Client: Intercept Privately */
                <div>
                  {!feedbackSubmitted ? (
                    <form onSubmit={handlePrivateSubmit} className="space-y-6">
                      <div className="flex items-start gap-4 border-l border-[#f0c067]/35 bg-[#070706] p-5 mb-6">
                        <ShieldAlert className="text-[#f0c067] shrink-0 mt-0.5" size={24} />
                        <div>
                          <h4 className="text-base font-black text-white">We want to make it right.</h4>
                          <p className="mt-2 text-xs leading-relaxed text-[#b9b2a6]">
                            Anthony personally reviews all feedback. Please share your phone and details below so we can contact you directly to resolve any concerns.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full border border-[#d8c7aa]/20 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-[#f0c067] focus:border-[#f0c067] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="651-555-0199"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full border border-[#d8c7aa]/20 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-[#f0c067] focus:border-[#f0c067] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.18em] text-[#c9c1b4] mb-2">
                          What could we have done better?
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={privateFeedback}
                          onChange={(e) => setPrivateFeedback(e.target.value)}
                          placeholder="Please let us know where our craftsmanship or service fell short..."
                          className="w-full border border-[#d8c7aa]/20 bg-[#070706] p-4 text-sm text-white focus-visible:ring-2 focus-visible:ring-[#f0c067] focus:border-[#f0c067] focus:outline-none resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#f0c067] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#15110a] transition-colors hover:bg-white disabled:opacity-55"
                      >
                        {isSubmitting ? 'Sending...' : 'Submit Feedback'} <MessageSquare size={18} />
                      </button>
                      {privateError && (
                        <p className="border-l border-[#f0c067]/45 bg-[#070706] p-4 text-xs font-semibold leading-relaxed text-[#f2d6a8]" role="alert">
                          {privateError}
                        </p>
                      )}
                    </form>
                  ) : (
                    /* Feedback Submitted Successfully */
                    <div className="text-center py-6">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0c067]/10 text-[#f0c067] mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-white">Feedback Received</h3>
                      <p className="mt-4 text-sm leading-relaxed text-[#c9c1b4]">
                        Thank you for your honesty, {clientName}. Anthony has been notified privately and will call you directly at {clientPhone} to address the details and make this right.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </PageTransition>
  );
}
