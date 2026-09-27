import { AppData, GymPhoto, GymReel, GymSettings, SubscriptionPlan, SubscriptionFormData } from '../types';

export const api = {
  async getAppData(): Promise<AppData> {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('فشل تحميل بيانات الموقع');
    return res.json();
  },

  async login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async updateSettings(settings: Partial<GymSettings>): Promise<{ success: boolean; settings: GymSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('فشل تحديث الإعدادات');
    return res.json();
  },

  // Photos
  async addPhoto(photo: { url: string; title: string }): Promise<{ success: boolean; photo: GymPhoto; photos: GymPhoto[] }> {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إضافة الصورة');
    }
    return res.json();
  },

  async updatePhoto(id: string, photo: { url?: string; title?: string }): Promise<{ success: boolean; photo: GymPhoto; photos: GymPhoto[] }> {
    const res = await fetch(`/api/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo)
    });
    if (!res.ok) throw new Error('فشل تعديل الصورة');
    return res.json();
  },

  async deletePhoto(id: string): Promise<{ success: boolean; photos: GymPhoto[] }> {
    const res = await fetch(`/api/photos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('فشل حذف الصورة');
    return res.json();
  },

  // Reels
  async addReel(reel: { url: string; title: string }): Promise<{ success: boolean; reel: GymReel; reels: GymReel[] }> {
    const res = await fetch('/api/reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reel)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إضافة الفيديو');
    }
    return res.json();
  },

  async updateReel(id: string, reel: { url?: string; title?: string }): Promise<{ success: boolean; reel: GymReel; reels: GymReel[] }> {
    const res = await fetch(`/api/reels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reel)
    });
    if (!res.ok) throw new Error('فشل تعديل الفيديو');
    return res.json();
  },

  async deleteReel(id: string): Promise<{ success: boolean; reels: GymReel[] }> {
    const res = await fetch(`/api/reels/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('فشل حذف الفيديو');
    return res.json();
  },

  // Plans
  async addPlan(plan: Omit<SubscriptionPlan, 'id' | 'order'>): Promise<{ success: boolean; plan: SubscriptionPlan; plans: SubscriptionPlan[] }> {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إضافة الاشتراك');
    }
    return res.json();
  },

  async updatePlan(id: string, plan: Partial<SubscriptionPlan>): Promise<{ success: boolean; plan: SubscriptionPlan; plans: SubscriptionPlan[] }> {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('فشل تعديل الاشتراك');
    return res.json();
  },

  async deletePlan(id: string): Promise<{ success: boolean; plans: SubscriptionPlan[] }> {
    const res = await fetch(`/api/plans/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('فشل حذف الاشتراك');
    return res.json();
  },

  async reorderPlans(planIds: string[]): Promise<{ success: boolean; plans: SubscriptionPlan[] }> {
    const res = await fetch('/api/plans-reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planIds })
    });
    if (!res.ok) throw new Error('فشل حفظ ترتيب الاشتراكات');
    return res.json();
  },

  // Subscriptions inquiries
  async submitSubscription(data: SubscriptionFormData): Promise<{ success: boolean }> {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getSubscriptions(): Promise<{ subscriptions: any[] }> {
    const res = await fetch('/api/subscriptions');
    return res.json();
  }
};
