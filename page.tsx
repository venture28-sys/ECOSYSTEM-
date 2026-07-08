import { notFound } from "next/navigation";
import {
  MapPin, BadgeCheck, ShieldCheck, PhoneCall, Circle, Award,
  Briefcase, ExternalLink, Pencil,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { roleLabel } from "@/lib/roles";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { StarRating } from "@/components/profile/star-rating";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user: viewer } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: skills }, { data: certificates }, { data: portfolio }, { data: jobs }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", params.id).single(),
      supabase.from("skills").select("*").eq("profile_id", params.id),
      supabase.from("certificates").select("*").eq("profile_id", params.id).order("issue_date", { ascending: false }),
      supabase.from("portfolio_items").select("*").eq("profile_id", params.id).order("created_at", { ascending: false }),
      supabase.from("completed_jobs").select("*").eq("profile_id", params.id).order("completed_at", { ascending: false }),
    ]);

  if (!profile) notFound();

  const isOwner = viewer?.id === profile.id;

  return (
    <>
      {/* Cover */}
      <div
        className="h-48 sm:h-56 bg-secondary relative"
        style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />

      <Container className="relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16">
          <div className="w-28 h-28 rounded-full border-4 border-[var(--bg)] bg-neutral-100 overflow-hidden shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-display font-bold text-neutral-300">
                {profile.full_name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-2xl">{profile.full_name}</h1>
              {profile.verification_status === "verified" && (
                <BadgeCheck size={20} className="text-accent" />
              )}
            </div>
            {profile.headline && <p className="text-neutral-400 mt-0.5">{profile.headline}</p>}
          </div>

          {isOwner && (
            <div className="pb-2">
              <Button href="/profile/edit" variant="secondary" size="sm">
                <Pencil size={14} /> Edit Profile
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-neutral-400">
          <Badge tone="primary">{roleLabel(profile.role)}</Badge>
          {profile.location && (
            <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
          )}
          <span className="flex items-center gap-1.5">
            <Circle size={9} className={profile.is_available ? "fill-success text-success" : "fill-neutral-300 text-neutral-300"} />
            {profile.is_available ? "Available for work" : "Not currently available"}
          </span>
          {profile.phone_verified && (
            <span className="flex items-center gap-1 text-success"><PhoneCall size={14} /> Phone verified</span>
          )}
          <StarRating value={profile.rating_avg} count={profile.rating_count} />
        </div>
      </Container>

      <Container className="grid lg:grid-cols-[2fr_1fr] gap-8 mt-4 mb-16">
        <div className="space-y-8">
          {profile.bio && (
            <Block>
              <h3 className="font-display font-semibold text-lg mb-3">About</h3>
              <p className="text-sm text-neutral-500 dark:text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </Block>
          )}

          {portfolio && portfolio.length > 0 && (
            <Block muted>
              <h3 className="font-display font-semibold text-lg mb-4">Portfolio</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <Card key={item.id}>
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    <h5 className="font-display font-semibold text-sm mb-1">{item.title}</h5>
                    {item.description && <p className="text-xs text-neutral-400 mb-2">{item.description}</p>}
                    {item.project_url && (
                      <a href={item.project_url} className="text-xs text-primary font-semibold inline-flex items-center gap-1">
                        View project <ExternalLink size={11} />
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </Block>
          )}

          {jobs && jobs.length > 0 && (
            <Block>
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" /> Completed Jobs ({profile.completed_jobs_count})
              </h3>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card key={job.id} hover={false}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h5 className="font-semibold text-sm">{job.title}</h5>
                      {job.completed_at && <span className="text-xs text-neutral-400">{job.completed_at}</span>}
                    </div>
                    {job.client_name && <p className="text-xs text-neutral-400 mb-1">Client: {job.client_name}</p>}
                    {job.description && <p className="text-xs text-neutral-400">{job.description}</p>}
                  </Card>
                ))}
              </div>
            </Block>
          )}
        </div>

        <div className="space-y-8">
          <Block>
            <h3 className="font-display font-semibold text-lg mb-4">Skills</h3>
            {skills && skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s.id} className="rounded-full bg-neutral-100 dark:bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No skills added yet.</p>
            )}
          </Block>

          <Block muted>
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Award size={18} className="text-primary" /> Certificates
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-3">
                    <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">{cert.title}</div>
                      <div className="text-xs text-neutral-400">
                        {cert.issuer} {cert.issue_date && `· ${cert.issue_date}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No certificates added yet.</p>
            )}
          </Block>
        </div>
      </Container>
    </>
  );
}

/** Simple padded block — unlike <Section>, does not add its own max-width container,
 *  since these are used inside an already-constrained grid column. */
function Block({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className={`rounded p-6 border border-neutral-100 dark:border-[var(--border)] ${muted ? "bg-[var(--surface-2)]" : "bg-[var(--surface)]"}`}>
      {children}
    </div>
  );
}
