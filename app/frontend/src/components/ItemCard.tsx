import { Building, Clock, MapPin, User2, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ItemData {
  id: number;
  name: string;
  location: string;
  foundDate: string;
  foundTime: string;
  keeper: string;
  foundBy: string;
  status: string;
  imageUrl: string;
}

interface ItemCardProps {
  item: ItemData;
  style?: React.CSSProperties;
}

export function ItemCard({ item, style }: ItemCardProps) {
  const isReturned = item.status === "รับคืนแล้ว";

  return (
    <Card
      className="overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-slide-up bg-card w-full p-0"
      style={style}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex gap-4 p-4">
            {/* Image placeholder */}
            <div className="w-full md:w-48 h-40 md:h-auto bg-muted flex items-center justify-center shrink-0">
              <div className="text-muted-foreground text-sm">รูปภาพ</div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-5">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {item.name}
              </h3>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 shrink-0" />
                  <span>พบที่: {item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    เวลา: {item.foundDate} {item.foundTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>ฝากไว้ที่: {item.keeper}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User2 className="h-4 w-4 shrink-0" />
                  <span>พบโดย: {item.foundBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 shrink-0 ${
                      isReturned ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={isReturned ? "text-primary font-medium" : ""}
                  >
                    สถานะ: {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action section */}
          {!isReturned && (
            <div className="p-4 md:p-5 md:ml-auto flex flex-col justify-center items-center bg-muted/50 md:w-40">
              <p className="text-sm text-muted-foreground mb-2">
                ของคุณใช่ไหม?
              </p>
              <Button variant="default" size="sm" className="font-medium">
                รับคืน
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
