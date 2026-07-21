import React from 'react';
import { AlertTriangle, WifiOff, SearchX, MapPinOff, RefreshCw } from 'lucide-react';

export default function HospitalErrorState({ error, onRetry }) {
  if (!error) return null;

  let Icon = AlertTriangle;
  let title = "Something went wrong";
  let message = "We couldn't fetch the hospital data. Please try again.";
  let actionText = "Try Again";

  // Categorize errors based on message content
  if (error.includes("VITE_GOOGLE_MAPS_API_KEY")) {
    Icon = AlertTriangle;
    title = "Google Maps API Key Missing";
    message = "The application requires a valid Google Maps API Key to function. Please add it to your .env file and restart the server.";
    actionText = null;
  } else if (error.includes("network") || error.includes("Failed to fetch")) {
    Icon = WifiOff;
    title = "No Internet Connection";
    message = "Please check your network connection and try again.";
  } else if (error.includes("ZERO_RESULTS")) {
    Icon = SearchX;
    title = "No Hospitals Found";
    message = "We couldn't find any hospitals matching your criteria in this location. Try broadening your search or selecting a different city.";
    actionText = "Clear Search";
  } else if (error.includes("geolocation") || error.includes("permission")) {
    Icon = MapPinOff;
    title = "Location Access Denied";
    message = "We couldn't detect your location. Please enter your city manually in the search bar.";
    actionText = null;
  } else if (error.includes("OVER_QUERY_LIMIT") || error.includes("REQUEST_DENIED")) {
    Icon = AlertTriangle;
    title = "Service Unavailable";
    message = "The hospital search service is temporarily unavailable (Quota Exceeded or Request Denied). Please try again later.";
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>

      {actionText && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          {actionText === "Try Again" && <RefreshCw className="w-4 h-4" />}
          {actionText}
        </button>
      )}
    </div>
  );
}
