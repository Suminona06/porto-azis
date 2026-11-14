import type {
  AboutBundle,
  BlogPost,
  ProjectItem,
  SiteProfile,
} from './types';

export const PLACEHOLDER_SITE_PROFILE: SiteProfile = {
  id: 1,
  display_name: 'AZIS MUHAMAD FADLI',
  wordmark: 'azis',
  role_en: 'IT SUPPORT, DEVOPS & CLOUD ENGINEER',
  role_id: 'IT SUPPORT, DEVOPS & CLOUD ENGINEER',
  location: 'INDONESIA',
  hero_bio_en:
    '[PLACEHOLDER] Maintaining resilient endpoints, automating delivery pipelines, and running dependable cloud workloads across hybrid environments.',
  hero_bio_id:
    '[PLACEHOLDER] Menjaga keandalan infrastruktur IT, mengotomasi pipeline deployment, dan mengelola sistem cloud yang stabil serta terpantau.',
  statement_en:
    '[PLACEHOLDER] FROM HELPDESK TRIAGE TO CONTAINER ORCHESTRATION AND CLOUD OBSERVABILITY, MY FOCUS IS KEEPING CRITICAL SYSTEMS CALM, PREDICTABLE, AND EASY TO RECOVER.',
  statement_id:
    '[PLACEHOLDER] DARI PENANGANAN INSIDEN HARIAN HINGGA OTOMASI CONTAINER DAN OBSERVABILITAS CLOUD, FOKUS SAYA ADALAH MEMASTIKAN SISTEM TETAP STABIL, TERUKUR, DAN MUDAH DIPULIHKAN.',
  marquee_roles: ['IT SUPPORT', 'DEVOPS', 'CLOUD ENGINEER', 'INFRASTRUCTURE'],
  marquee_stack: [
    'LINUX',
    'DOCKER',
    'KUBERNETES',
    'TERRAFORM',
    'AWS',
    'GITHUB ACTIONS',
    'PROMETHEUS',
    'NGINX',
  ],
  circle_quote_en: 'RELIABLE SYSTEMS BEGIN WITH OBSERVABILITY AND CALM RECOVERY',
  circle_quote_id: 'SISTEM YANG ANDAL DIMULAI DARI OBSERVABILITAS DAN PEMULIHAN YANG TENANG',
  favorite_tech: [
    { name: 'Linux', slug: 'linux' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Kubernetes', slug: 'kubernetes' },
    { name: 'Terraform', slug: 'terraform' },
    { name: 'AWS', slug: 'aws' },
  ],
  contact_url: 'mailto:azis.placeholder@example.com',
  social_links: [
    { label: 'GITHUB', url: 'https://github.com/azisfadli-placeholder' },
    { label: 'LINKEDIN', url: 'https://linkedin.com/in/azisfadli-placeholder' },
    { label: 'EMAIL', url: 'mailto:azis.placeholder@example.com' },
  ],
};

export const PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    id: '33333333-3333-4333-8333-333333333301',
    title: '[SAMPLE] Multi-Node Docker Observability Stack',
    tech_stack: ['DOCKER', 'PROMETHEUS', 'GRAFANA', 'NGINX'],
    external_url: 'https://github.com/azisfadli-placeholder/observability-stack',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2025',
    featured_on_home: true,
    sort_order: 1,
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    title: '[SAMPLE] AWS VPC & Bastion Terraform Blueprint',
    tech_stack: ['TERRAFORM', 'AWS', 'IAM', 'VPC'],
    external_url: 'https://github.com/azisfadli-placeholder/aws-vpc-blueprint',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2025',
    featured_on_home: true,
    sort_order: 2,
  },
  {
    id: '33333333-3333-4333-8333-333333333303',
    title: '[SAMPLE] GitHub Actions Self-Hosted Runner Setup',
    tech_stack: ['GITHUB ACTIONS', 'LINUX', 'SYSTEMD', 'CADDY'],
    external_url: 'https://github.com/azisfadli-placeholder/actions-runner-setup',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2024',
    featured_on_home: true,
    sort_order: 3,
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    title: '[SAMPLE] IT Support Workstation Audit & Onboarding CLI',
    tech_stack: ['BASH', 'POWERSHELL', 'SSH', 'WIREGUARD'],
    external_url: 'https://github.com/azisfadli-placeholder/support-audit-cli',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2024',
    featured_on_home: true,
    sort_order: 4,
  },
  {
    id: '33333333-3333-4333-8333-333333333305',
    title: '[SAMPLE] Automated PostgreSQL Backup & Restore Pipeline',
    tech_stack: ['POSTGRESQL', 'S3', 'CRON', 'ENCRYPTION'],
    external_url: 'https://github.com/azisfadli-placeholder/pg-backup-pipeline',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2023',
    featured_on_home: false,
    sort_order: 5,
  },
];

export const PLACEHOLDER_ABOUT: AboutBundle = {
  sections: {
    id: 1,
    headline_en:
      '[PLACEHOLDER] Azis Muhamad Fadli is an IT Support, DevOps, and Cloud Engineer focused on pragmatic systems and repeatable operations.',
    headline_id:
      '[PLACEHOLDER] Azis Muhamad Fadli adalah seorang IT Support, DevOps, dan Cloud Engineer yang berfokus pada infrastruktur praktis dan operasi sistem yang andal.',
    profile_image_url: '/placeholders/profile-placeholder.svg',
    journey_en:
      '[PLACEHOLDER] Starting on the frontline of IT Support taught me how real people experience infrastructure failures. Every slow VPN, misconfigured DNS record, or broken workstation was a lesson in patience and root-cause isolation.\n\n[PLACEHOLDER] Over time, those support tickets became the foundation for automation: repeatable Bash scripts, containerized internal services, CI/CD runners, and structured Linux server provisioning across cloud VMs.',
    journey_id:
      '[PLACEHOLDER] Memulai karier di garis depan IT Support mengajarkan bagaimana gangguan sistem berdampak langsung pada pekerjaan pengguna. Setiap kendala jaringan, DNS, atau perangkat menjadi latihan analisis akar masalah.\n\n[PLACEHOLDER] Dari tiket harian itu lahir kebutuhan akan otomasi: skrip pemulihan terstandar, kontainerisasi layanan internal, pipeline CI/CD, dan pengelolaan infrastruktur cloud yang terstruktur.',
    philosophy_en:
      '[PLACEHOLDER] CLEAR RUNBOOKS, VERSIONED INFRASTRUCTURE, AND HONEST MONITORING REDUCE INCIDENT STRESS FOR THE ENTIRE TEAM.',
    philosophy_id:
      '[PLACEHOLDER] RUNBOOK YANG JELAS, INFRASTRUKTUR TERKONTROL VERSI, DAN MONITORING YANG JUJUR MENURUNKAN BEBAN SAAT INSIDEN TERJADI.',
    interest_en:
      '[PLACEHOLDER] Outside daily operations, I document homelab experiments with Proxmox, self-hosted backups, network segmentation, and post-incident notes to share practical troubleshooting paths.',
    interest_id:
      '[PLACEHOLDER] Di luar pekerjaan operasional, saya mendokumentasikan eksperimen homelab dengan Proxmox, sistem backup mandiri, segmentasi jaringan, serta catatan pasca-insiden sebagai referensi praktis.',
    interest_image_url: '/placeholders/interest-placeholder.svg',
  },
  skillGroups: [
    {
      id: '11111111-1111-4111-8111-111111111101',
      title_en: 'IT Support & Systems Administration',
      title_id: 'IT Support & Administrasi Sistem',
      items: [
        'Linux & Windows Troubleshooting',
        'Active Directory & IAM',
        'DNS / DHCP / VPN Diagnostics',
        'Endpoint Hardening',
        'Asset & Incident Documentation',
      ],
      sort_order: 1,
    },
    {
      id: '11111111-1111-4111-8111-111111111102',
      title_en: 'DevOps & Automation',
      title_id: 'DevOps & Otomasi',
      items: [
        'Docker & Docker Compose',
        'GitHub Actions CI/CD',
        'Bash & Python Scripting',
        'Nginx Reverse Proxy',
        'Zero-Downtime Rollouts',
      ],
      sort_order: 2,
    },
    {
      id: '11111111-1111-4111-8111-111111111103',
      title_en: 'Cloud Infrastructure & Orchestration',
      title_id: 'Infrastruktur Cloud & Orkestrasi',
      items: [
        'AWS EC2 / S3 / VPC / IAM',
        'Terraform Infrastructure as Code',
        'Kubernetes Workloads',
        'Cloudflare DNS & TLS',
        'Automated Snapshot Backups',
      ],
      sort_order: 3,
    },
    {
      id: '11111111-1111-4111-8111-111111111104',
      title_en: 'Observability & Security',
      title_id: 'Observabilitas & Keamanan',
      items: [
        'Prometheus & Grafana',
        'Log Aggregation',
        'SSL / TLS Automation',
        'Least-Privilege Access Reviews',
        'Post-Incident Runbooks',
      ],
      sort_order: 4,
    },
  ],
  activities: [
    {
      id: '22222222-2222-4222-8222-222222222201',
      title_en: '[SAMPLE] Cloud Infrastructure & DevOps Operations',
      title_id: '[SAMPLE] Operasional Cloud Infrastructure & DevOps',
      subtitle_en: 'CONTAINERIZATION & CI/CD WORKFLOWS',
      subtitle_id: 'KONTENERISASI & ALUR CI/CD',
      description_en:
        '[PLACEHOLDER] Standardized staging and production deployments with Docker, automated health checks, and documented rollback playbooks.',
      description_id:
        '[PLACEHOLDER] Menstandarkan deployment staging dan produksi menggunakan Docker, pemeriksaan kesehatan otomatis, dan panduan rollback.',
      category: 'WORK',
      location: 'Jakarta, Indonesia',
      year: '2025',
      image_url: '/placeholders/activity-placeholder.svg',
      sort_order: 1,
    },
    {
      id: '22222222-2222-4222-8222-222222222202',
      title_en: '[SAMPLE] IT Support & Network Reliability Desk',
      title_id: '[SAMPLE] IT Support & Keandalan Jaringan',
      subtitle_en: 'WORKSTATION & INTERNAL INFRASTRUCTURE',
      subtitle_id: 'PERANGKAT KERJA & JARINGAN INTERNAL',
      description_en:
        '[PLACEHOLDER] Handled hardware provisioning, VPN onboarding, ticket triage, and clear SOP guides for hybrid teams.',
      description_id:
        '[PLACEHOLDER] Menangani pengadaan perangkat, konfigurasi VPN, triase tiket, dan penyusunan SOP kerja untuk tim hybrid.',
      category: 'SUPPORT',
      location: 'Bandung, Indonesia',
      year: '2024',
      image_url: '/placeholders/activity-placeholder.svg',
      sort_order: 2,
    },
    {
      id: '22222222-2222-4222-8222-222222222203',
      title_en: '[SAMPLE] Homelab & Self-Hosted Telemetry Lab',
      title_id: '[SAMPLE] Homelab & Eksperimen Telemetri Mandiri',
      subtitle_en: 'PROXMOX + PROMETHEUS + GRAFANA',
      subtitle_id: 'PROXMOX + PROMETHEUS + GRAFANA',
      description_en:
        '[PLACEHOLDER] Built an isolated lab environment to test VM backups, firewall rules, and alert routing before production rollouts.',
      description_id:
        '[PLACEHOLDER] Membangun lingkungan lab terisolasi untuk menguji backup VM, aturan firewall, dan notifikasi peringatan.',
      category: 'LAB',
      location: 'Indonesia',
      year: '2023',
      image_url: '/placeholders/activity-placeholder.svg',
      sort_order: 3,
    },
  ],
};

export const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    id: '44444444-4444-4444-8444-444444444401',
    slug: 'checklist-troubleshooting-linux-server-down',
    title: '[SAMPLE] Checklist Cepat Saat Linux Server Tiba-Tiba Unreachable',
    excerpt:
      'Urutan pemeriksaan 5 menit dari lapisan jaringan, disk penuh, hingga konsumsi memori untuk insiden server produksi.',
    content_markdown: `## Mengapa Urutan Pemeriksaan Itu Penting

Saat server produksi tidak bisa dijangkau lewat HTTP maupun SSH, kepanikan sering membuat engineer langsung melakukan reboot sebelum mengumpulkan jejak akar masalah.

Checklist singkat berikut membantu memastikan kita memeriksa gejala dari luar ke dalam secara runtut.

## 1. Verifikasi Jangkauan Jaringan & DNS

Mulai dari memeriksa apakah nama domain masih mengarah ke IP yang benar dan apakah port layanan terbuka.

\`\`\`bash
dig +short app.example.com
nc -zv 203.0.113.10 443
ss -tulpn | grep -E ":(80|443|22)"
\`\`\`

## 2. Periksa Kapasitas Disk & Inode

Log aplikasi atau container yang tidak dirotasi dapat menghabiskan ruang disk hingga 100% dan membuat proses autentikasi maupun database gagal menulis.

\`\`\`bash
df -h
df -i
du -sh /var/log/* | sort -hr | head -n 10
\`\`\`

| Gejala | Perintah Cek | Tindakan Aman Pertama |
| --- | --- | --- |
| Disk \`/var\` penuh | \`df -h\` | Bersihkan log lama atau container dangling |
| Inode habis | \`df -i\` | Cari direktori dengan jutaan file kecil |
| OOM Killer aktif | \`dmesg -T | grep -i oom\` | Batasi memori container dan cek memory leak |

## 3. Dokumentasikan Sebelum Reboot

> Simpan output \`journalctl -xeu <service>\` sebelum restart layanan agar investigasi pasca-insiden memiliki bukti yang utuh.
`,
    category: 'Troubleshooting',
    language: 'id',
    translation_group_id: '55555555-5555-4555-8555-555555555501',
    cover_image_url: '',
    reading_minutes: 4,
    published: true,
    published_at: '2025-11-10T09:00:00Z',
    created_at: '2025-11-10T09:00:00Z',
  },
  {
    id: '44444444-4444-4444-8444-444444444402',
    slug: 'zero-downtime-docker-compose-healthcheck',
    title: '[SAMPLE] Structuring Zero-Downtime Container Updates on Single-VM Hosts',
    excerpt:
      'Practical healthcheck, reverse proxy upstream timeout, and rollback patterns when running small workloads without full Kubernetes.',
    content_markdown: `## When Single-VM Simplicity Fits Best

Not every internal tool needs a multi-node Kubernetes cluster on day one. On a well-sized Linux VM, predictable healthchecks and reverse proxy timeouts eliminate cold drops during deployments.

## Explicit Container Healthchecks

Declare an explicit \`healthcheck\` so orchestration tools and deploy scripts wait until the runtime actually serves HTTP 200 instead of checking PID startup alone.

\`\`\`yaml
services:
  web:
    image: ghcr.io/example/service:1.4.2
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://127.0.0.1:8080/health"]
      interval: 15s
      timeout: 3s
      retries: 3
      start_period: 20s
\`\`\`

## Keep Rollbacks Boring

1. Always tag images with the Git commit SHA rather than relying exclusively on \`latest\`.
2. Verify health endpoints locally before shifting proxy traffic.
3. Keep the previous image cached locally for fast fallback.
`,
    category: 'DevOps',
    language: 'en',
    translation_group_id: '55555555-5555-4555-8555-555555555501',
    cover_image_url: '',
    reading_minutes: 3,
    published: true,
    published_at: '2025-10-28T09:00:00Z',
    created_at: '2025-10-28T09:00:00Z',
  },
  {
    id: '44444444-4444-4444-8444-444444444403',
    slug: 'catatan-desain-vpc-aws-sederhana-aman',
    title: '[SAMPLE] Catatan Merancang Subnet Publik dan Privat di AWS VPC',
    excerpt:
      'Pemisahan trafik ingress dan beban kerja backend agar database serta VM internal tidak terekspos langsung ke internet.',
    content_markdown: `## Prinsip Dasar Pemisahan Subnet

Memisahkan Load Balancer atau Bastion di subnet publik dan memindahkan aplikasi beserta database ke subnet privat secara drastis memperkecil permukaan serangan.

## Aturan Security Group Minimal

- Izinkan port \`80\` dan \`443\` hanya pada Application Load Balancer.
- Referensikan ID Security Group milik ALB di Security Group instance aplikasi, bukan CIDR \`0.0.0.0/0\`.
- Gunakan AWS SSM Session Manager atau Bastion terotentikasi untuk akses shell.

\`\`\`hcl
resource "aws_security_group_rule" "app_from_alb" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.alb.id
}
\`\`\`
`,
    category: 'Cloud',
    language: 'id',
    translation_group_id: null,
    cover_image_url: '',
    reading_minutes: 3,
    published: true,
    published_at: '2025-10-12T09:00:00Z',
    created_at: '2025-10-12T09:00:00Z',
  },
];
