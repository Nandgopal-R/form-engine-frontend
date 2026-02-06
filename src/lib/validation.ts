/**
 * Validation rules for modern form builder
 */

export const validateEmail = (email: string) => {
    if (!email) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? null : "Please enter a valid email address (e.g., name@domain.com)";
};

export const validateURL = (url: string) => {
    if (!url) return null;
    try {
        new URL(url);
        return null;
    } catch (_) {
        return "Please enter a valid URL (e.g., https://example.com)";
    }
};

export const validatePhone = (phone: string) => {
    if (!phone) return null;
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
        return "Phone number must be exactly 10 digits";
    }
    return null;
};

export const validatePassword = (password: string) => {
    if (!password) return null;

    if (password.length > 10) {
        return "Password cannot exceed 10 characters";
    }

    const errors: string[] = [];
    if (!/[A-Z]/.test(password)) errors.push("uppercase");
    if (!/[a-z]/.test(password)) errors.push("lowercase");
    if (!/[0-9]/.test(password)) errors.push("number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("special character");

    if (errors.length > 0) {
        return `Password must include: ${errors.join(", ")}`;
    }

    return null;
};

export const validateFileSize = (fileSize: number, maxSizeMB: number = 5) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (fileSize > maxBytes) {
        return `File size exceeds ${maxSizeMB}MB limit`;
    }
    return null;
};

export const validateFileType = (fileName: string, allowedTypes: string[]) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension || !allowedTypes.includes(extension)) {
        return `Invalid file type. Allowed: ${allowedTypes.join(", ")}`;
    }
    return null;
};
export const validatePercentage = (val: any) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    if (isNaN(num)) return "Please enter a valid number";
    if (num > 100) return "invalid percentage";
    if (num < 0) return "Percentage cannot be negative";
    return null;
};
