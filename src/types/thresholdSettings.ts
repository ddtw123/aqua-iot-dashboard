export interface ThresholdConfig {
    min: number;
    max: number;
}

export interface ThresholdSettings {
    temp: ThresholdConfig;
    ph: ThresholdConfig;
    ammonia: ThresholdConfig;
    turbidity: ThresholdConfig;
    salinity: ThresholdConfig;
}

export const defaultThresholds: ThresholdSettings = {
    temp: { min: 15, max: 30 },
    ph: { min: 5, max: 9.0 },
    ammonia: { min: 0, max: 0.25 },
    turbidity: { min: 25, max: 60 },
    salinity: { min: 0, max: 100 }
};

export const sensorRanges = {
    temp: { min: 0, max: 40 },
    ph: { min: 0, max: 14 },
    ammonia: { min: 0, max: 2 },
    turbidity: { min: 0, max: 100 },
    salinity: { min: 0, max: 100 }

};

export async function fetchDeviceThresholds(deviceId: string): Promise<ThresholdSettings> {
    try {
        // auto_seed=1 ensures defaults are inserted if none exist for this device
        const resp = await fetch(`/api/thresholds?device_id=${encodeURIComponent(deviceId)}&auto_seed=1`, { cache: 'no-store' });
        if (!resp.ok) throw new Error('fetch failed');
        const json = await resp.json();
        const items: Array<{ parameter: string; min: number; max: number }> = json.items || [];
        const merged: ThresholdSettings = { ...defaultThresholds } as ThresholdSettings;
        items.forEach(it => {
            if (it.parameter in merged) {
                (merged as unknown as Record<string, ThresholdConfig>)[it.parameter] = { min: Number(it.min), max: Number(it.max) };
            }
        });
        return merged;
    } catch {
        return defaultThresholds;
    }
}

export async function saveDeviceThresholds(deviceId: string, settings: ThresholdSettings) {
    const payload = {
        device_id: deviceId,
        items: Object.entries(settings).map(([parameter, cfg]) => ({ parameter, min: cfg.min, max: cfg.max }))
    };
    const resp = await fetch('/api/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error('save failed');
}