export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12 py-4">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Health Idol AI. All rights reserved.</p> {/* Updated site name */}
        <p className="text-xs mt-1 text-muted-foreground">
          Disclaimer: Information provided is for educational purposes only and not a substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
}
