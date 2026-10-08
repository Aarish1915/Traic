# Cognitive Psychology & UX Laws Specification

> **Engineering Principle**: Every UI element, layout decision, color assignment, and interaction pattern must be mathematically grounded in established human-computer interaction (HCI) laws.

---

## 1. Matrix of UX Laws & Implementation Requirements

### 1.1 Von Restorff Effect (Isolation Effect)
* **Psychological Definition**: When multiple homogeneous stimuli are presented, the stimulus that differs from the rest is most likely to be remembered.
* **Violation in Old Design**: Cyan accent (`#00E5FF`) was applied 38 times on a single page (every badge, card border, icon, title, and link). Over-saturation neutralized the accent, destroying visual hierarchy.
* **Apple HIG Solution**:
  - The accent color (`#64D2FF`) is restricted to **3 distinct roles only**:
    1. Primary CTA button ("Join TRAIC").
    2. Exactly **one key word** in the primary hero headline ("We build machines. We build <span class="text-accent">ideas.</span>").
    3. Active navigation/scroll-spy states.
  - All category chips, discipline tags, and monoline icons use muted neutral grays (`var(--text-secondary)` or `var(--border-subtle)`).
* **Target Metric**: Accent coverage < 5% of total visible viewport area.

---

### 1.2 Hick’s Law (Decision Time)
* **Psychological Definition**: The time it takes to make a decision increases logarithmically with the number and complexity of choices:
  $$T = b \cdot \log_2(n + 1)$$
* **Violation in Old Design**: 11 repetitive homepage sections, duplicate "Join" triggers in nav, and 16 cluttered footer links leading to dead anchors.
* **Apple HIG Solution**:
  - Homepage consolidated to **7 distinct cognitive sections**:
    1. Hero Showcase
    2. Disciplines (Bento Grid)
    3. Lab in Motion (Workshop Carousel)
    4. Featured Projects (Case Studies)
    5. Impact & Authority (Patents + Single-source Numbers)
    6. Events (Upcoming Spotlight + Past Sessions)
    7. Join & Community Footer
  - Desktop Navigation pruned to $n = 5$ essential destinations: *Disciplines, Projects, Patents, Events, Team*.
  - Footer pruned to 4 semantic columns with real, verified routes.

---

### 1.3 Fitts’s Law (Target Acquisition)
* **Psychological Definition**: The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target:
  $$MT = a + b \log_2\left(1 + \frac{D}{W}\right)$$
* **Violation in Old Design**: Nav links and footer links had 0 internal padding (only flex gap), making clickable target height as small as 14px. Social icons were 40×40px.
* **Apple HIG Solution**:
  - **44pt / 44px Minimum Hit Target**: Every interactive element (`<a>`, `<button>`, `<input>`) has a minimum target dimension of $44\times44\text{px}$.
  - Nav and footer links utilize `padding: 0 16px; min-height: 44px; display: inline-flex; align-items: center;`.
  - **Mobile Bottom Tab Bar**: On mobile viewports ($\le 960\text{px}$), main navigation shifts from the hard-to-reach top edge to a floating translucent bottom bar positioned directly in Steven Hoober's natural **One-Thumb Zone**.

---

### 1.4 Jakob’s Law (Mental Models & Familiarity)
* **Psychological Definition**: Users spend most of their time on other sites, and prefer your site to work the same way as all the other sites they already know.
* **Violation in Old Design**: Project cards had hover zoom animations but were dead `<div>` tags with no links. Mobile viewports hid critical "View all" buttons.
* **Apple HIG Solution**:
  - Standard top brand logo linking to `#top`.
  - Project cards are semantic `<button type="button">` or `<a>` elements with explicit pointer affordance and native `<dialog>` triggers for case studies.
  - Consistent layout paradigms: standard bento grids, standard horizontal carousel controls, standard modal close keys (`Escape` key support).

---

### 1.5 Norman’s Affordances & Signifiers
* **Psychological Definition**: An affordance is what an object can do; a signifier is any perceptual indicator that reveals what affordance is available.
* **Violation in Old Design**: Horizontal galleries had no scroll cues, indicators, or arrows. Visitors on trackpads or mice had no indication that the gallery scrolled horizontally.
* **Apple HIG Solution**:
  - Horizontal carousel includes prominent circular previous/next navigation buttons (`#gallery-prev`, `#gallery-next`) with 44px hit targets and hover scaling.
  - Trackpad users get smooth touch momentum with CSS `scroll-snap-type: x mandatory`.

---

### 1.6 Nielsen’s Usability Heuristics
1. **Visibility of System Status**:
   - Navigation utilizes an `IntersectionObserver` scroll-spy that dynamically updates `aria-current="page"` on desktop nav and mobile bottom tab bar as the user scrolls.
   - Recruitment form features explicit submitting states (`submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'`) and dedicated success/error message containers with `aria-live="polite"`.
2. **Error Prevention & Helpful Recovery**:
   - Inputs validate in real time on blur and input change.
   - Errors display localized inline alerts with `aria-describedby` associations, rather than generic alert popups.
3. **Consistency & Standards**:
   - Unified terminology: the call-to-action is consistently titled **"Join TRAIC"** everywhere.

---

### 1.7 Doherty Threshold (Sub-400ms Feedback Loop)
* **Psychological Definition**: Productivity soars when a computer and its users interact at a pace that ensures neither has to wait on the other ($< 400\text{ms}$).
* **Violation in Old Design**: Tailwind CDN compiled at runtime in the browser; 18 unoptimized images with zero dimensions caused massive Cumulative Layout Shift (CLS).
* **Apple HIG Solution**:
  - Pure zero-runtime CSS (or build-time compiled Tailwind).
  - Explicit aspect ratios (`16/9`, `16/10`) on all image/video containers to completely prevent layout shift.
  - Native browser `<dialog>` modals open in $< 5\text{ms}$ with zero network delay.

---

### 1.8 Social Proof, Authority & Reciprocity
* **Authority Anchor**: Replaced conflicting stat counters with a single, verifiable institutional record:
  - **21** Years of Innovation
  - **100+** Shipped Projects
  - **500+** Engineers Mentored
  - **50+** National Trophies
* **Official Patent Feature**: Highlights the club's intellectual property (*Adaptive SLAM Navigation System*) with a dedicated patent card and institutional backing strip (COER University Innovation Cell, IEEE, DST Hardware Grants).
* **Reciprocity Proposition**: Solves the "asking without giving" flaw by guaranteeing tangible student perks before the recruitment form:
  1. Free hardware starter kit and component access.
  2. Direct 1-on-1 mentorship from senior firmware/robotics leads.
  3. University credit and patent co-authorship.

---

### 1.9 Peak-End Rule & Serial Position Effect
* **Peak**: The Hero section features a clean silhouette of the autonomous robotics platform rising from the bottom edge against a subtle radial cyan rim light.
* **End**: The site closes with a high-trust, welcoming recruitment container ("Build what's next with us.") followed by the club's official creed: **"Honor · Honesty · Sacrifice"**.
