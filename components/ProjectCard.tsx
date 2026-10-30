import { ArrowUpRight, Code2, Sparkles } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const atmospheres = [
  'from-[#174435] via-[#10231b] to-[#0a100c]',
  'from-[#284335] via-[#162219] to-[#0a100c]',
  'from-[#1a4938] via-[#11271d] to-[#0a100c]',
];

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="project-card group overflow-hidden rounded-[1.7rem] border border-white/[.08] bg-[#0b1118]/75 transition duration-500 hover:-translate-y-1 hover:border-[#34d399]/30 hover:shadow-[0_30px_90px_rgba(0,0,0,.3)]">
      <div className={`relative isolate flex h-52 items-end overflow-hidden bg-gradient-to-br ${atmospheres[index % atmospheres.length]} p-6 md:h-60 md:p-8`}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div aria-hidden="true" className="absolute -right-8 -top-20 size-64 rounded-full border border-[#a7f3d0]/15 transition duration-700 group-hover:scale-110 group-hover:border-[#34d399]/35" />
        <div aria-hidden="true" className="absolute -right-1 top-6 size-48 rounded-full border border-[#a7f3d0]/10 transition duration-700 group-hover:-translate-x-2 group-hover:translate-y-2" />
        <div aria-hidden="true" className="absolute right-16 top-16 size-20 rounded-full bg-[#34d399]/10 blur-2xl transition duration-700 group-hover:bg-[#34d399]/20" />
        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f0d]/35 px-3 py-2 backdrop-blur-xl md:left-8 md:top-8">
          <Sparkles size={13} className="text-[#34d399]" aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-white/65">{project.category}</span>
        </div>
        <span className="absolute right-6 top-7 font-mono text-[10px] text-white/35 md:right-8 md:top-9">/{String(index + 1).padStart(2, '0')}</span>
        <p className="relative max-w-[80%] font-bebas text-4xl leading-[.9] tracking-[-.02em] text-white/90 md:text-5xl">{project.title}</p>
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#34d399]/70 via-white/10 to-transparent" />
      </div>

      <div className="p-6 md:p-8">
        <p className="min-h-[4.5rem] text-sm leading-7 text-white/55">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tag) => <span key={tag} className="rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[10px] text-white/45">{tag}</span>)}
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-white/[.07] pt-5">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#34d399] px-4 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#0a0f0d] transition hover:bg-white">Live project <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code on GitHub`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-[10px] font-bold uppercase tracking-[.12em] text-white/65 transition hover:border-[#34d399]/40 hover:text-[#34d399]"><Code2 size={14} aria-hidden="true" /> Source</a>}
          {!project.liveUrl && !project.githubUrl && <span className="text-xs text-white/35">Selected project</span>}
        </div>
      </div>
    </article>
  );
}
