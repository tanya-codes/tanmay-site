import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Something went wrong." };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Section boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 text-center text-sm text-[#273C46] uppercase tracking-widest">
          Section unavailable
        </div>
      );
    }
    return this.props.children;
  }
}
