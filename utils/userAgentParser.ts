/**
 * Parse browser name from User Agent string
 */
export const parseBrowserName = (userAgent: string): string => {
  if (!userAgent) return 'Unknown';
  
  const ua = userAgent.toLowerCase();
  
  // Check for Chrome
  if (ua.includes('chrome/') && !ua.includes('edg/')) {
    const match = ua.match(/chrome\/(\d+\.\d+\.\d+\.\d+)/);
    return match ? `Chrome ${match[1]}` : 'Chrome';
  }
  
  // Check for Edge
  if (ua.includes('edg/')) {
    const match = ua.match(/edg\/(\d+\.\d+\.\d+\.\d+)/);
    return match ? `Edge ${match[1]}` : 'Edge';
  }
  
  // Check for Firefox
  if (ua.includes('firefox/')) {
    const match = ua.match(/firefox\/(\d+\.\d+)/);
    return match ? `Firefox ${match[1]}` : 'Firefox';
  }
  
  // Check for Safari
  if (ua.includes('safari/') && !ua.includes('chrome/')) {
    const match = ua.match(/version\/(\d+\.\d+)/);
    return match ? `Safari ${match[1]}` : 'Safari';
  }
  
  // Check for Opera
  if (ua.includes('opr/') || ua.includes('opera/')) {
    const match = ua.match(/(opr|opera)\/(\d+\.\d+)/);
    return match ? `Opera ${match[2]}` : 'Opera';
  }
  
  // Check for Internet Explorer
  if (ua.includes('msie') || ua.includes('trident')) {
    if (ua.includes('msie')) {
      const match = ua.match(/msie (\d+\.\d+)/);
      return match ? `IE ${match[1]}` : 'IE';
    } else {
      const match = ua.match(/rv:(\d+\.\d+)/);
      return match ? `IE ${match[1]}` : 'IE';
    }
  }
  
  return '';
};

/**
 * Parse OS name from User Agent string
 */
export const parseOSName = (userAgent: string): string => {
  if (!userAgent) return '';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('windows nt 10')) return 'Windows 10';
  if (ua.includes('windows nt 6.3')) return 'Windows 8.1';
  if (ua.includes('windows nt 6.2')) return 'Windows 8';
  if (ua.includes('windows nt 6.1')) return 'Windows 7';
  if (ua.includes('windows nt 6.0')) return 'Windows Vista';
  if (ua.includes('windows nt 5.1')) return 'Windows XP';
  if (ua.includes('windows')) return 'Windows';
  
  if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x ([0-9_]+)/);
    if (match) {
      return `macOS ${match[1].replace(/_/g, '.')}`;
    }
    return 'macOS';
  }
  
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('ubuntu')) return 'Ubuntu';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  
  return '';
};

/**
 * Parse device type from User Agent string
 */
export const parseDeviceType = (userAgent: string): string => {
  if (!userAgent) return '';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'Mobile';
  }
  
  return 'Desktop';
};
