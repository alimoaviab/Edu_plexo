const ACADEMY_CARE_STORAGE_KEY = "academy_care_id";

export function getSelectedAcademyCareId(): string | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    const value = window.localStorage.getItem(ACADEMY_CARE_STORAGE_KEY);
    return value && value.trim().length > 0 ? value : undefined;
}

export function setSelectedAcademyCareId(value: string): void {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(ACADEMY_CARE_STORAGE_KEY, value);
}

export function getAcademyCareQuery(): string {
    const academyCareId = getSelectedAcademyCareId();
    if (!academyCareId) {
        return "";
    }

    const search = new URLSearchParams({ academy_care_id: academyCareId });
    return `?${search.toString()}`;
}
