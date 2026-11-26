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
    { label: 'LINKEDIN', url: 'https://linkedin.com/in/azisfadli-placeholder' },
    { label: 'GITHUB', url: 'https://github.com/azisfadli-placeholder' },
    { label: 'INSTAGRAM', url: 'https://instagram.com/azisfadli-placeholder' },
    { label: 'THREADS', url: 'https://threads.net/@azisfadli-placeholder' },
  ],
};

export const PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    id: '33333333-3333-4333-8333-333333333301',
    title: 'Docker Observability Stack',
    tech_stack: ['DOCKER', 'PROMETHEUS', 'GRAFANA', 'NGINX'],
    external_url: 'https://github.com/azisfadli-placeholder/observability-stack',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2025',
    featured_on_home: true,
    sort_order: 1,
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    title: 'AWS VPC Terraform Blueprint',
    tech_stack: ['TERRAFORM', 'AWS', 'IAM', 'VPC'],
    external_url: 'https://github.com/azisfadli-placeholder/aws-vpc-blueprint',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2025',
    featured_on_home: true,
    sort_order: 2,
  },
  {
    id: '33333333-3333-4333-8333-333333333303',
    title: 'Self-Hosted CI/CD Runner',
    tech_stack: ['GITHUB ACTIONS', 'LINUX', 'SYSTEMD', 'CADDY'],
    external_url: 'https://github.com/azisfadli-placeholder/actions-runner-setup',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2024',
    featured_on_home: true,
    sort_order: 3,
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    title: 'Workstation Audit & Setup CLI',
    tech_stack: ['BASH', 'POWERSHELL', 'SSH', 'WIREGUARD'],
    external_url: 'https://github.com/azisfadli-placeholder/support-audit-cli',
    banner_url: '/placeholders/work-placeholder.svg',
    year: '2024',
    featured_on_home: true,
    sort_order: 4,
  },
  {
    id: '33333333-3333-4333-8333-333333333305',
    title: 'PostgreSQL Backup Pipeline',
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
    headline_en: 'AZIS MUHAMAD FADLI\nCLOUD & DEVOPS ENGINEER',
    headline_id: 'AZIS MUHAMAD FADLI\nCLOUD & DEVOPS ENGINEER',
    profile_image_url: '/placeholders/profile-placeholder.svg',
    journey_en:
      'Starting on the frontline of IT Support taught me how real people experience infrastructure failures. Every slow VPN tunnel, misconfigured DNS record, or unresponsive workstation was a lesson in calm triage and root-cause isolation.\n\nOver time, resolving recurring tickets evolved into building automation. I began replacing manual fixes with repeatable Bash and Python scripts, containerized internal services with Docker, and CI/CD pipelines that keep deployments predictable.\n\nToday, my focus bridges systems reliability and cloud engineering, from provisioning reproducible Linux workloads with Terraform and AWS to instrumenting Prometheus and Grafana observability so teams can recover fast and ship with confidence.',
    journey_id:
      'Memulai karier di garis depan IT Support mengajarkan saya bagaimana gangguan infrastruktur berdampak langsung pada pekerjaan pengguna. Setiap kendala VPN, kesalahan DNS, atau perangkat kerja yang bermasalah menjadi latihan triase yang tenang dan isolasi akar masalah.\n\nSeiring waktu, penyelesaian tiket berulang berkembang menjadi upaya otomasi. Saya mulai mengganti perbaikan manual dengan skrip Bash dan Python yang terstandar, kontainerisasi layanan internal dengan Docker, serta pipeline CI/CD agar deployment tetap terprediksi.\n\nKini fokus saya menjembatani keandalan sistem dan rekayasa cloud, mulai dari penyediaan beban kerja Linux yang reprodusibel menggunakan Terraform dan AWS hingga observabilitas Prometheus dan Grafana agar tim dapat pulih cepat dan merilis dengan tenang.',
    philosophy_en:
      'I build resilient systems where clear runbooks, versioned infrastructure, and honest monitoring turn complex operations into calm, repeatable engineering.',
    philosophy_id:
      'Saya merancang sistem yang tangguh, di mana runbook yang jelas, infrastruktur terkontrol versi, dan monitoring yang jujur mengubah operasi kompleks menjadi proses yang tenang dan terprediksi.',
    interest_en:
      'Outside daily operations, I spend time refining a personal homelab built on Proxmox, testing self-hosted backup workflows, VLAN segmentation, and local DNS routing. Treating home infrastructure like a small production lab keeps troubleshooting instincts sharp without risking client environments.\n\nAway from the terminal, I make room for slower routines through technical field reading, post-incident case studies, and regular exercise to reset focus. Stepping back from alerts and dashboards helps bring steadier judgment back to complex engineering work.',
    interest_id:
      'Di luar pekerjaan operasional harian, saya meluangkan waktu mengembangkan homelab pribadi berbasis Proxmox, menguji alur backup mandiri, segmentasi VLAN, dan perutean DNS lokal. Memperlakukan infrastruktur rumahan seperti lab produksi kecil menjaga ketajaman triase tanpa mengganggu lingkungan klien.\n\nSaat jauh dari terminal, saya menjaga ritme lewat bacaan catatan teknis, studi kasus pasca-insiden, serta olahraga rutin untuk memulihkan fokus. Mengambil jarak sejenak dari notifikasi dan dasbor membantu menghadirkan pertimbangan yang lebih tenang saat kembali menangani sistem.',
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
      title_en: 'Cloud Infrastructure & DevOps Operations',
      title_id: 'Operasional Cloud Infrastructure & DevOps',
      subtitle_en: 'CONTAINERIZATION & CI/CD WORKFLOWS',
      subtitle_id: 'KONTENERISASI & ALUR CI/CD',
      description_en:
        'Standardized staging and production deployments with Docker, automated health checks, and documented rollback playbooks.',
      description_id:
        'Menstandarkan deployment staging dan produksi menggunakan Docker, pemeriksaan kesehatan otomatis, dan panduan rollback.',
      category: 'WORK',
      location: 'Jakarta, Indonesia',
      year: '2025',
      image_url: '',
      sort_order: 1,
    },
    {
      id: '22222222-2222-4222-8222-222222222202',
      title_en: 'IT Support & Network Reliability Desk',
      title_id: 'IT Support & Keandalan Jaringan',
      subtitle_en: 'WORKSTATION & INTERNAL INFRASTRUCTURE',
      subtitle_id: 'PERANGKAT KERJA & JARINGAN INTERNAL',
      description_en:
        'Handled hardware provisioning, VPN onboarding, ticket triage, and clear SOP guides for hybrid teams.',
      description_id:
        'Menangani pengadaan perangkat, konfigurasi VPN, triase tiket, dan penyusunan SOP kerja untuk tim hybrid.',
      category: 'SUPPORT',
      location: 'Bandung, Indonesia',
      year: '2024',
      image_url: '',
      sort_order: 2,
    },
    {
      id: '22222222-2222-4222-8222-222222222203',
      title_en: 'Homelab & Self-Hosted Telemetry Lab',
      title_id: 'Homelab & Eksperimen Telemetri Mandiri',
      subtitle_en: 'PROXMOX + PROMETHEUS + GRAFANA',
      subtitle_id: 'PROXMOX + PROMETHEUS + GRAFANA',
      description_en:
        'Built an isolated lab environment to test VM backups, firewall rules, and alert routing before production rollouts.',
      description_id:
        'Membangun lingkungan lab terisolasi untuk menguji backup VM, aturan firewall, dan notifikasi peringatan.',
      category: 'LAB',
      location: 'Indonesia',
      year: '2023',
      image_url: '',
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

