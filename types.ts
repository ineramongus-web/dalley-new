export enum AppView {
  GALLERY = 'GALLERY',
  EDITOR = 'EDITOR',
  LOGIC = 'LOGIC'
}

export interface UDim2 {
  X: { Scale: number; Offset: number }
  Y: { Scale: number; Offset: number }
}

export interface Vector2 {
  X: number
  Y: number
}

export interface Color3 {
  R: number
  G: number
  B: number
}

export type RobloxElementType = 'Frame' | 'TextLabel' | 'TextButton' | 'ImageLabel' | 'ImageButton' | 'ScrollingFrame' | 'TextBox' | 'ViewportFrame'

export interface UIElementFunction {
  id: string
  eventName: string
  animationId: string
  enabled: boolean
}

export interface UIElement {
  id: string
  type: RobloxElementType
  name: string
  parent?: string
  visible: boolean
  locked: boolean
  properties: {
    Position: UDim2
    Size: UDim2
    AnchorPoint: Vector2
    BackgroundColor3: Color3
    BackgroundTransparency: number
    BorderColor3: Color3
    BorderSizePixel: number
    ClipsDescendants: boolean
    Visible: boolean
    ZIndex: number
    Rotation: number
    Text?: string
    TextColor3?: Color3
    TextSize?: number
    TextXAlignment?: 'Left' | 'Center' | 'Right'
    TextYAlignment?: 'Top' | 'Center' | 'Bottom'
    TextScaled?: boolean
    TextWrapped?: boolean
    Font?: string
    Image?: string
    ImageColor3?: Color3
    ImageTransparency?: number
    ScaleType?: 'Stretch' | 'Slice' | 'Tile' | 'Fit' | 'Crop'
    UICorner?: { CornerRadius: { Scale: number; Offset: number } }
    UIStroke?: { 
      Color: Color3
      Thickness: number
      Transparency: number
    }
  }
  functions: UIElementFunction[]
}

export interface AnimationKeyframe {
  id: string
  elementId: string
  time: number
  properties: Record<string, any>
  sprSettings: {
    dampingRatio: number
    undampedFrequency: number
  }
}

export interface Project {
  id: string
  name: string
  elements: UIElement[]
  animations: AnimationKeyframe[]
  duration: number
  lastModified: number
  // Added missing properties for GalleryView
  version?: string;
  date?: string;
  iconClass?: string;
  legacy?: boolean;
}